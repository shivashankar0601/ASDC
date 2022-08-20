import { AuthRequest } from './../types/AuthRequest';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Auth } from '../auth.decorator';
import { IsAuthGuard } from '../is-auth.guard';
import { RoleType } from '../types/RoleType';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { PropertiesService } from './properties.service';

@Controller('properties')
@ApiTags('Property')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @ApiBearerAuth()
  @UseGuards(IsAuthGuard)
  @Auth([RoleType.landlord, RoleType.admin])
  @Post()
  create(
    @Body() createPropertyDto: CreatePropertyDto,
    @Req() req: AuthRequest,
  ) {
    return this.propertiesService.create(createPropertyDto, req.user);
  }

  @Get()
  findAll() {
    return this.propertiesService.findAll();
  }

  @Get('/search')
  findByLatLong(
    @Query('lat') lat: number,
    @Query('lng') lng: number,
    @Query('radius') radius: string,
    @Query('houseType') houseType: string,
    @Query('price') price: string,
    @Query('room') room: string,
  ) {
    return this.propertiesService.findWithInRadius(
      lat,
      lng,
      radius,
      price,
      room,
      houseType,
    );
  }

  @Get('/search2')
  findByLatLong2(
    @Query('lat') lat: number,
    @Query('lng') lng: number,
    @Query('radius') radius: string,
    @Query('houseType') houseType: string,
    @Query('price') price: string,
    @Query('room') room: string,
  ) {
    return this.propertiesService.findWithInRadius2(
      lat,
      lng,
      radius,
      price,
      room,
      houseType,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.propertiesService.findOne(+id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(IsAuthGuard)
  @Auth([RoleType.landlord, RoleType.admin])
  update(
    @Param('id') id: string,
    @Body() updatePropertyDto: UpdatePropertyDto,
    @Req() req: AuthRequest,
  ) {
    return this.propertiesService.update(+id, updatePropertyDto, req.user);
  }

  @Patch('admin/:id')
  @ApiBearerAuth()
  @UseGuards(IsAuthGuard)
  @Auth([RoleType.admin])
  updateByAdmin(
    @Param('id') id: string,
    @Body() updatePropertyDto: UpdatePropertyDto,
  ) {
    return this.propertiesService.updateByAdmin(+id, updatePropertyDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(IsAuthGuard)
  @Auth([RoleType.landlord, RoleType.admin])
  remove(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.propertiesService.remove(+id, req.user);
  }

  @Delete('admin/:id')
  @ApiBearerAuth()
  @UseGuards(IsAuthGuard)
  @Auth([RoleType.admin])
  removeByAdmin(@Param('id') id: string) {
    return this.propertiesService.removeByAdmin(+id);
  }
}
