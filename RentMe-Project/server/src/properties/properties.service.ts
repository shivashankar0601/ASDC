import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import NodeGeocoder from 'node-geocoder';
import puppeteer from 'puppeteer';
import { Repository } from 'typeorm';
import { PropertyImage } from './../property-images/entities/property-image.entity';
import { PropertyImagesService } from './../property-images/property-images.service';
import { PaginatedResponse } from './../types/PaginatedResponse';
import { User } from './../users/entities/user.entity';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { Property } from './entities/property.entity';
dotenv.config();

const options: NodeGeocoder.GoogleOptions = {
  provider: 'google',
  apiKey: process.env.GOOGLE_API || '',
};

@Injectable()
export class PropertiesService {
  geocoder = NodeGeocoder(options);
  constructor(
    @InjectRepository(Property)
    private readonly propertyRepo: Repository<Property>,
    private readonly propertyImageService: PropertyImagesService,
  ) {}
  async create(createPropertyDto: CreatePropertyDto, user: User) {
    const property = await this.propertyRepo.save({
      ...createPropertyDto,
      user,
      bathrooms: createPropertyDto.bathrooms.toString(),
      bedrooms: createPropertyDto.bedrooms.toString(),
    });
    if (createPropertyDto.images.length) {
      const images: PropertyImage[] = [];
      for (let i = 0; i < createPropertyDto.images.length; i++) {
        const image = await this.propertyImageService.create({
          imagePublicId: createPropertyDto.images[i].imagePublicId,
          imageUrl: createPropertyDto.images[i].imageUrl,
          propertyId: property.id,
        });
        images.push(image);
      }
      property.propertiesImages = images;
      property.featuredImage = images[0].imageUrl;
      property.featuredImageId = images[0].imagePublicId;
      await this.propertyRepo.save(property);
    }

    return property;
  }

  findAll(): Promise<PaginatedResponse> {
    return this.propertyRepo
      .createQueryBuilder('property')
      .leftJoinAndSelect('property.user', 'user')
      .orderBy('property.createdAt', 'DESC')
      .paginate();
  }

  async findWithInRadius(
    latitude: number,
    longitude: number,
    radius: string,
    price: string,
    room: string,
    houseType: string,
  ) {
    const radiusArr = radius.split('-');
    const priceArr = price.split('-');

    const data = await this.propertyRepo.query(`
      SELECT * FROM (
        SELECT  *, 
        ( 6371 * 
          acos( 
            cos( radians(${latitude}) ) 
            * cos( radians( latitude ) ) 
            * cos( radians( longitude ) - radians(${longitude}) ) 
            + sin( radians(${latitude}) )  
            * sin( radians( latitude ) ) ) ) AS distance
          FROM property
    ) as al
      WHERE 
        distance BETWEEN 0 AND ${+radiusArr[1]}
        AND
        price BETWEEN 0 AND ${+priceArr[1]}
        AND
        bedrooms LIKE '%${room}%'
      ORDER BY distance
    `);

    return data;
  }

  async findWithInRadius2(
    latitude: number,
    longitude: number,
    radius: string,
    price: string,
    room: string,
    houseType: string,
  ) {
    const radiusArr = radius.split('-');
    const priceArr = price.split('-');

    const data = await this.propertyRepo.query(`
        SELECT * FROM (
          SELECT  *, 
            ( 6371 * 
              acos( 
                cos( radians(${latitude}) ) 
                * cos( radians( latitude ) ) 
                * cos( radians( longitude ) - radians(${longitude}) ) 
                + sin( radians(${latitude}) )  
                * sin( radians( latitude ) ) ) ) AS distance
              FROM property
        ) as al
     
        WHERE distance < ${+radiusArr[1]}
    `);
    console.log(data);
    

    return data;
  }

  findOne(id: number) {
    return this.propertyRepo.findOne(id, {
      relations: ['propertiesImages', 'user'],
    });
  }

  async update(id: number, updatePropertyDto: UpdatePropertyDto, user: User) {
    const property = await this.findOne(id);
    if (!property) {
      throw new NotFoundException('Property Not Found');
    }
    if (property.user.id !== user.id) {
      throw new UnauthorizedException();
    }
    return this.propertyRepo.save({
      ...property,
      ...updatePropertyDto,
      userId: user.id,
      bathrooms: updatePropertyDto.bathrooms.toString(),
      bedrooms: updatePropertyDto.bedrooms.toString(),
    });
  }

  async updateByAdmin(id: number, updatePropertyDto: UpdatePropertyDto) {
    const property = await this.findOne(id);
    if (!property) {
      throw new NotFoundException('Property Not Found');
    }

    return this.propertyRepo.save({
      ...property,
      ...updatePropertyDto,
      bathrooms: updatePropertyDto.bathrooms.toString(),
      bedrooms: updatePropertyDto.bedrooms.toString(),
    });
  }

  async remove(id: number, user: User) {
    const status = await this.propertyRepo.delete({ id, userId: user.id });
    return !!status;
  }
  async removeByAdmin(id: number) {
    const status = await this.propertyRepo.delete({ id });
    return !!status;
  }

  // we run cron jobs after 12AM because all the websites might be updating the websites data at 12:00 AM,
  // so we will start scrapping the data assuming that they will be done in 1 hour

  // @Cron('*/1 * * * *')
  @Cron('0 1 * * *') // Everyday at 1:00 AM
  async scrapKijiji() {
    console.log('Kijiji Data Scrapper Started');
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(
      'https://www.kijiji.ca/b-nova-scotia/apartment/k0l9002?dc=true',
    );
    const finalData = [];

    const listings = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.search-item'));
    });

    for (let i = 0; i < listings.length; i++) {
      const UrlAndImg = await page.evaluate((a) => {
        const data = [...document.querySelectorAll('.search-item')][a];
        const url = (data.querySelector('a.title ') as HTMLAnchorElement).href;
        const img = (data.querySelector('.image img') as HTMLImageElement).src;
        const beds = (data.querySelector('.bedrooms') as HTMLDivElement)
          .innerText;
        return { url, img, beds };
      }, i);

      const bedrooms = UrlAndImg.beds.includes(':')
        ? UrlAndImg.beds.split(':')[1]
        : 0;

      await page.evaluate((a) => {
        return (
          [...document.querySelectorAll('.search-item')][a] as HTMLElement
        ).click();
      }, i);
      await page.waitForNavigation();
      const title = await page.evaluate(() => {
        return (
          document.querySelector('div[class*="title-"]') as HTMLHeadingElement
        ).innerText;
      });
      const description = await page.evaluate(() => {
        return (
          document.querySelector(
            'div[class*="descriptionContainer-"]',
          ) as HTMLDivElement
        ).textContent;
      });
      const price = await page.evaluate(() => {
        const rawPrice = (
          document.querySelector(
            'div[class*="priceWrapper-"] > span',
          ) as HTMLDivElement
        ).textContent.split('$');
        return rawPrice[1] ? parseInt(rawPrice[1].split(',').join('')) : 0;
      });
      const address = await page.evaluate(() => {
        return (
          document.querySelector('span[class*="address-"]') as HTMLDivElement
        ).innerText;
      });

      const res = await this.geocoder.geocode(address);

      finalData.push({
        title,
        description,
        price,
        address,
        url: UrlAndImg.url,
        userId: 1,
        featuredImage: UrlAndImg.img,
        latitude: res[0].latitude,
        longitude: res[0].longitude,
        bedrooms,
      });
      await page.goBack();
    }

    finalData.map((item) => {
      this.propertyRepo.save(item);
    });

    await browser.close();
  }

  // @Cron('*/5 * * * *')
  @Cron('30 1 * * *') // we will run at 1:30 AM everyday
  async scrapKillamReit() {
    const options = { width: 1920, height: 1080 };
    console.log('KillamReit Data Scrapper Started');
    const browser = await puppeteer.launch({
      headless: true,
      ignoreHTTPSErrors: true,
      args: [`--window-size=1920,1080`],
      defaultViewport: {
        width: 1920,
        height: 1080,
      },
    });
    const page = await browser.newPage();
    await page.goto('https://killamreit.com/apartments?region=Halifax', {
      waitUntil: 'networkidle0',
    });

    // await page.screenshot({path:"aaaa.jpg",fullPage:true})

    const finalData = [];

    const listings = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll('.killam-search-result-card'),
      );
    });

    let count = 0;

    console.log(listings.length, 'properties are listed');
    for (let i = 0; i < listings.length; i++) {
      try {
        const extractedData = await page.evaluate((a) => {
          const data = [
            ...document.querySelectorAll('.killam-search-result-card'),
          ][a];
          let url = 'N/A';
          try {
            url = data.querySelectorAll('a')[2].href;
          } catch (Error) {}

          let img = 'N/A';
          try {
            img = data
              .querySelector('.flex-active-slide > img')
              .getAttribute('src');
          } catch (Error) {}
          let beds = 'N/A';
          try {
            beds = data
              .querySelector('.killam-search-result-info')
              .querySelector('.killam-search-card-ranges').children[2]
              .children[1].textContent;
          } catch (Error) {}
          let title = 'N/A';
          try {
            title = data.querySelector(
              '.killam-search-result-info-title',
            ).textContent;
          } catch (Error) {}

          let price = '0';
          try {
            price = data
              .querySelector('.killam-search-result-info')
              .querySelector('.killam-search-card-ranges').children[0]
              .children[1].textContent;
            price = (
              price.includes('-')
                ? price.split('-')[price.split('-').length - 1]
                : price
            ).replace(/[^0-9..]+/g, '');
          } catch (Error) {}
          let newPrice = 0;
          try {
            newPrice = Number(price);
          } catch (Error) {}
          let latitude = 'N/A';
          try {
            latitude = data
              .querySelector('.apartment-location')
              .getAttribute('data-lat');
          } catch (Error) {}
          let longitude = 'N/A';
          try {
            longitude = data
              .querySelector('.apartment-location')
              .getAttribute('data-lng');
          } catch (Error) {}
          return { url, img, beds, title, newPrice, latitude, longitude };
        }, i);

        const spage = await browser.newPage();

        await spage.goto(extractedData.url, {
          waitUntil: 'networkidle0',
          timeout: 0,
        });
        await spage.waitForSelector('.c-page-main-block__body');
        await spage.waitForSelector('.c-property-heading__address');

        // await page.waitForNavigation();

        // await spage.screenshot({path:"middle"+i+".jpg",fullPage:true})

        const details = await spage.evaluate((a) => {
          let description = 'N/A';
          try {
            description = document.querySelector('.c-page-main-block__body')
              .children[0].textContent;
          } catch (Error) {}
          let address = 'N/A';
          try {
            address = document
              .querySelector('.c-property-heading__address')
              .textContent.replace(/\n+/g, ' ');
          } catch (Error) {}
          return { description, address };
        }, i);

        await spage.close();

        // console.log('title : ',extractedData.title);
        // console.log('description : ',details.description);
        // console.log('price : ',extractedData.price);
        // console.log('address : ',details.address);
        // console.log('url : ',extractedData.url);
        // console.log('featuredImg : ',extractedData.img);
        // console.log('latitude : ',extractedData.latitude);
        // console.log('longitude : ',extractedData.longitude);
        // console.log('bedrooms : ',extractedData.beds);
        // console.log("****************************")
        // break;

        count = count + 1;

        finalData.push({
          title: extractedData.title,
          description: details.description,
          price: extractedData.newPrice,
          address: details.address,
          url: extractedData.url,
          userId: 1,
          featuredImage: extractedData.img,
          latitude: extractedData.latitude,
          longitude: extractedData.longitude,
          bedrooms: extractedData.beds,
        });

        // console.log("******",count,"******")
      } catch (Error) {
        // an error will occur when there is no availability
        //console.log("***********error occured***********")
      }
    }

    finalData.map((item) => {
      this.propertyRepo.save(item);
    });

    console.log(count, ' properties scrapped successfully from KillamReit');

    await browser.close();
  }

  // @Cron('*/10 * * * *')
  @Cron('0 2 * * *') // will run at 2AM in the morning
  async scrapCapreit() {
    console.log('Capreit Data Scrapper Started');
    const browser = await puppeteer.launch({
      headless: true,
      ignoreHTTPSErrors: true,
      args: [`--window-size=1920,1080`],
      defaultViewport: {
        width: 1920,
        height: 1080,
      },
    });
    const page = await browser.newPage();
    await page.goto(
      'https://www.capreit.ca/apartments-for-rent/?where=Halifax',
      {
        waitUntil: 'networkidle0',
      },
    );

    // await page.screenshot({path:"aaaa.jpg",fullPage:true})

    const finalData = [];

    // const noOfProperties = await page.evaluate((a)=>{
    //   return Array.from(document.querySelectorAll('.property-item')).length
    // });
    const noOfProperties = 1000;

    let count = 0;
    for (let i = 0; i < noOfProperties; i++) {
      // await page.screenshot({path:"begin"+i+".jpg",fullPage:true})
      try {
        const extractedData = await page.evaluate((a) => {
          const data = [...document.querySelectorAll('.property-item')][a];
          const title = data.querySelector(
            '.property-item-content-title',
          ).textContent;
          const url = (
            data.querySelector(
              '.property-item-content-title',
            ) as HTMLAnchorElement
          ).href;
          const img = (
            data.querySelector('.property-item-image')
              .children[0] as HTMLImageElement
          ).src;
          let price = (
            data.querySelector('.property-item-content-price') as HTMLElement
          ).textContent;
          price = (
            price.includes('-')
              ? price.split('-')[price.split('-').length - 1]
              : price
          ).replace(/[^0-9..]+/g, '');
          const beds = (
            data.querySelector('.property-item-content-rooms') as HTMLDivElement
          ).textContent;
          const address = (
            data.querySelector(
              '.property-item-content-address',
            ) as HTMLDivElement
          ).textContent;
          return { url, img, beds, title, price, address };
        }, i);

        let description = '';

        try {
          const spage = await browser.newPage();

          await spage.goto(extractedData.url, {
            waitUntil: 'networkidle0',
            timeout: 0,
          });

          // await spage.screenshot({path:"middle.jpg",fullPage:true})

          description = await spage.evaluate(() => {
            const data = [
              ...document.querySelectorAll(
                '.property-features-content-container-right',
              ),
            ][0].children[1];
            const elements = data.querySelectorAll('p');
            let description = '';
            for (let j = 0; j < elements.length; j++) {
              description += elements[j].textContent.trim();
            }
            return description.replace('\\n', '');
          }, i);

          await spage.close();
        } catch (Error) {
          // console.log(Error)
        }

        const res = await this.geocoder.geocode(extractedData.address);

        // console.log("------------------------------------------------------------------------------------------------")
        // console.log('title : ',extractedData.title);
        // console.log('description : ',description.length==0?"NA":description);
        // console.log('price : ',extractedData.price);
        // console.log('address : ',extractedData.address);
        // console.log('url : ',extractedData.url);
        // console.log('featuredImg : ',extractedData.img);
        // console.log('latitude : ',res[0].latitude);
        // console.log('longitude : ',res[0].longitude);
        // console.log('bedrooms : ',extractedData.beds);
        count = count + 1;

        finalData.push({
          title: extractedData.title,
          description: description,
          price: extractedData.price,
          address: extractedData.address,
          url: extractedData.url,
          userId: 1,
          featuredImage: extractedData.img,
          latitude: res[0].latitude,
          longitude: res[0].longitude,
          bedrooms: extractedData.beds,
        });
      } catch (Error) {}
    }

    finalData.map((item) => {
      this.propertyRepo.save(item);
    });
    // console.log(count," complete extraction")
    console.log(count, ' properties scrapped successfully from Capreit');

    await browser.close();
  }
}
