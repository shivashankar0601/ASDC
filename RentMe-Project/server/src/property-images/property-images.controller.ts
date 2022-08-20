import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreatePropertyImageDto } from './dto/create-property-image.dto';
import { PropertyImagesService } from './property-images.service';

@Controller('property-images')
@ApiTags('Property Images')
export class PropertyImagesController {
  constructor(private readonly propertyImagesService: PropertyImagesService) {}

  @Post()
  create(@Body() createPropertyImageDto: CreatePropertyImageDto) {
    return this.propertyImagesService.create(createPropertyImageDto);
  }

  @Get()
  findAll() {
    return this.propertyImagesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.propertyImagesService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.propertyImagesService.remove(+id);
  }
}
