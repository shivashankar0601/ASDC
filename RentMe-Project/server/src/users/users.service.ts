import { UpdateUserByAdminDto } from './dto/update-user-admin.dto';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginatedResponse } from 'src/types/PaginatedResponse';
import { Repository } from 'typeorm';
import { RegisterDTO } from './../auth/dto/register.dto';
import { RoleType } from './../types/RoleType';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from './entities/role.entity';
import { User } from './entities/user.entity';
import { hash } from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
    @InjectRepository(Role) private readonly roleRepo: Repository<Role>,
  ) {}
  async create(createUserDto: RegisterDTO, roleType: RoleType): Promise<User> {
    const isFoundEmail = await this.findByEmail(createUserDto.email);
    if (isFoundEmail) {
      throw new ConflictException('email already taken');
    }
    const role = await Role.findOne({ where: { name: roleType } });
    if (!role) {
      throw new BadRequestException();
    }
    const entity = Object.assign(new User(), createUserDto);
    entity.role = role;
    return this.usersRepo.save(entity);
  }

  findAll(type: string): Promise<PaginatedResponse> {
    if (type.length) {
      return this.usersRepo
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.role', 'role')
        .where('role.name = :type', { type })
        .orderBy('user.createdAt', 'DESC')
        .paginate();
    } else {
      return this.usersRepo
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.role', 'role')
        .orderBy('user.createdAt', 'DESC')
        .paginate();
    }
  }

  findOne(id: number): Promise<User | undefined> {
    return this.usersRepo.findOne(id, { relations: ['role'] });
  }

  findByEmail(email: string): Promise<User | undefined> {
    return this.usersRepo.findOne({
      where: { email: email },
      relations: ['role'],
    });
  }

  async update(updateUserDto: UpdateUserDto, user: User): Promise<User> {
    if (updateUserDto.fullname && updateUserDto.fullname.trim().length) {
      user.fullname = updateUserDto.fullname;
    }

    await this.usersRepo.save(user);

    return user;
  }

  async updateByAdmin(
    updateUserDto: UpdateUserByAdminDto,
    id: string,
  ): Promise<User> {
    const user = await this.findOne(+id);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    if (updateUserDto.fullname.trim().length) {
      user.fullname = updateUserDto.fullname;
    }
    if (updateUserDto.password.trim().length) {
      user.password = await hash(updateUserDto.password, 12);
    }
    if (updateUserDto.role !== user.role.name) {
      const role = await this.roleRepo.findOne({
        where: { name: updateUserDto.role },
      });
      if (!role) {
        throw new NotFoundException('Role Not Found');
      }
      user.role = role;
    }

    return user.save();
  }

  async remove(user: User): Promise<boolean> {
    const deleted = await this.usersRepo.delete({ id: user.id });
    return !!deleted;
  }
}
