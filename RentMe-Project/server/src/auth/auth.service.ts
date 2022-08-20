import { welcomeMailTemplate } from './../config/WelcomeMailTemplate';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sgMail from '../config/SendGrid';
import { RoleType } from '../types/RoleType';
import { User } from './../users/entities/user.entity';
import { UsersService } from './../users/users.service';
import { PayloadType } from './auth.utility';
import { LoginDTO } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async login(loginDTO: LoginDTO): Promise<User> {
    let user: User | undefined = undefined;

    user = await this.usersService.findByEmail(loginDTO.email);

    if (!user) {
      throw new NotFoundException('user not found');
    }
    const isValid = await compare(loginDTO.password, user.password);

    if (!isValid) {
      throw new BadRequestException('Incorrect Password');
    }
    return user;
  }

  async register(registerDTO: RegisterDTO): Promise<User> {
    const user = await this.usersService.create(registerDTO, RoleType.user);
    const msg = {
      to: user.email,
      from: 'ferinpatel79@gmail.com',
      subject: 'Welcome to RentMe',
      html: welcomeMailTemplate,
    };
    sgMail
      .send(msg)
      .then(() => {
        console.log('Email sent');
      })
      .catch((error) => {
        console.log(error);
      });
    return user;
  }

  async registerAdmin(registerDTO: RegisterDTO): Promise<User> {
    const user = await this.usersService.create(registerDTO, RoleType.admin);
    const msg = {
      to: user.email,
      from: 'ferinpatel79@gmail.com',
      subject: 'Welcome to RentMe',
      html: welcomeMailTemplate,
    };
    sgMail
      .send(msg)
      .then(() => {
        console.log('Email sent');
      })
      .catch((error) => {
        console.log(error);
      });

    return user;
  }

  async registerLanlord(registerDTO: RegisterDTO): Promise<User> {
    const user = await this.usersService.create(registerDTO, RoleType.landlord);
    const msg = {
      to: user.email,
      from: 'ferinpatel79@gmail.com',
      subject: 'Welcome to RentMe',
      html: welcomeMailTemplate,
    };
    sgMail
      .send(msg)
      .then(() => {
        console.log('Email sent');
      })
      .catch((error) => {
        console.log(error);
      });

    return user;
  }

  async accessTokenVerify(data: {
    access_token: string;
  }): Promise<User | undefined> {
    const isTokenValid = jwt.verify(
      data.access_token,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      process.env.ACCESS_SECRET!,
    ) as PayloadType;
    if (!isTokenValid) {
      throw new BadRequestException('jwt malformed');
    }
    return this.usersService.findOne(isTokenValid.id);
  }
}
