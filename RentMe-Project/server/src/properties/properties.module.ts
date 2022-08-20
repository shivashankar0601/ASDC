import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertyImagesService } from 'src/property-images/property-images.service';
import { PropertyImage } from './../property-images/entities/property-image.entity';
import { Property } from './entities/property.entity';
import { PropertiesController } from './properties.controller';
import { PropertiesService } from './properties.service';

@Module({
  imports: [TypeOrmModule.forFeature([Property, PropertyImage])],
  controllers: [PropertiesController],
  providers: [PropertiesService, PropertyImagesService],
})
export class PropertiesModule {}
