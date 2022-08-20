import { UpdateUserByAdminDto } from './dto/update-user-admin.dto';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Query,
  Req,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PaginatedResponse } from 'src/types/PaginatedResponse';
import { serializeUser } from './../auth/auth.utility';
import { IsAuthGuard } from './../is-auth.guard';
import { AuthRequest } from './../types/AuthRequest';
import { RoleType } from './../types/RoleType';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('User')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    const user = await this.usersService.findOne(+id);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return serializeUser(user);
  }

  @ApiBearerAuth()
  @ApiQuery({ name: 'type', required: false })
  @UseGuards(IsAuthGuard)
  @SetMetadata('auth', [RoleType.admin])
  @Get('')
  async findAll(@Query('type') type: string): Promise<PaginatedResponse> {
    const users = await this.usersService.findAll(type.toLocaleLowerCase());
    users.data = users.data.map((item: User) => serializeUser(item));
    return users;
  }

  @ApiBearerAuth()
  @UseGuards(IsAuthGuard)
  @SetMetadata('auth', [])
  @Patch()
  update(
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: AuthRequest,
  ): Promise<User> {
    if (!req.user) {
      throw new BadRequestException();
    }
    return this.usersService.update(updateUserDto, req.user);
  }

  @ApiBearerAuth()
  @UseGuards(IsAuthGuard)
  @SetMetadata('auth', [RoleType.admin])
  @Patch('/admin/:id')
  updateByAdmin(
    @Body() updateUserDto: UpdateUserByAdminDto,
    @Param('id') id: string,
  ): Promise<User> {
    return this.usersService.updateByAdmin(updateUserDto, id);
  }

  @ApiBearerAuth()
  @UseGuards(IsAuthGuard)
  @SetMetadata('auth', [])
  @Delete()
  remove(@Req() req: AuthRequest): Promise<boolean> {
    if (!req.user) {
      throw new BadRequestException();
    }
    return this.usersService.remove(req.user);
  }
}
