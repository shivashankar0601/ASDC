import {
  Body,
  Controller,
  NotFoundException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Auth } from '../auth.decorator';
import { IsAuthGuard } from '../is-auth.guard';
import { RoleType } from './../types/RoleType';
import { User } from './../users/entities/user.entity';
import { AuthService } from './auth.service';
import { generateTokens, serializeUser } from './auth.utility';
import { LoginDTO } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';

export type AuthResponse = Promise<{
  user: User;
  accessToken: string;
  refreshToken: string;
}>;

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDTO: LoginDTO): AuthResponse {
    const user = await this.authService.login(loginDTO);
    const tokens = generateTokens(user);

    return {
      user: serializeUser(user),
      ...tokens,
    };
  }

  @Post('accessToken')
  async accessToken(@Body() data: { access_token: string }): AuthResponse {
    console.log(data);
    const user = await this.authService.accessTokenVerify(data);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    const tokens = generateTokens(user);

    return {
      user: serializeUser(user),
      ...tokens,
    };
  }

  @Post('register')
  async register(@Body() registerDTO: RegisterDTO): AuthResponse {
    const user = await this.authService.register(registerDTO);
    const tokens = generateTokens(user);

    return {
      user: serializeUser(user),
      ...tokens,
    };
  }

  @Post('register/landlord')
  async registerLandlord(@Body() registerDTO: RegisterDTO): AuthResponse {
    const user = await this.authService.registerLanlord(registerDTO);
    const tokens = generateTokens(user);

    return {
      user: serializeUser(user),
      ...tokens,
    };
  }

  @Post('register/admin')
  @ApiBearerAuth()
  @UseGuards(IsAuthGuard)
  @Auth([RoleType.admin])
  async registerAdmin(@Body() registerDTO: RegisterDTO): AuthResponse {
    const user = await this.authService.registerAdmin(registerDTO);
    const tokens = generateTokens(user);

    return {
      user: serializeUser(user),
      ...tokens,
    };
  }
}
