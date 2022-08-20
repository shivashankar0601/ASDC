import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertyImage } from './entities/property-image.entity';
import { PropertyImagesController } from './property-images.controller';
import { PropertyImagesService } from './property-images.service';

@Module({
  imports: [TypeOrmModule.forFeature([PropertyImage])],
  controllers: [PropertyImagesController],
  providers: [PropertyImagesService],
  exports: [PropertyImagesService],
})
export class PropertyImagesModule {}
