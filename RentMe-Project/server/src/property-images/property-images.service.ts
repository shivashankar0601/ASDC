import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePropertyImageDto } from './dto/create-property-image.dto';
import { PropertyImage } from './entities/property-image.entity';

@Injectable()
export class PropertyImagesService {
  constructor(
    @InjectRepository(PropertyImage)
    private readonly propertyImageRepo: Repository<PropertyImage>,
  ) {}
  create(createPropertyImageDto: CreatePropertyImageDto) {
    return this.propertyImageRepo.save(createPropertyImageDto);
  }

  findAll() {
    return this.propertyImageRepo.find();
  }

  findOne(id: number) {
    return this.propertyImageRepo.findOne(id);
  }

  async remove(id: number) {
    const isDeleted = await this.propertyImageRepo.delete(id);
    return !!isDeleted;
  }
}
