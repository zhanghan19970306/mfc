import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth';
import { RefreshDto } from './dto/refresh-auth';
import { AuthGuard } from './auth.guard';
import { Result } from '@/shared/result';

@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  async login(@Body() loginAuthDto: LoginAuthDto) {
    const info = await this.authService.login(loginAuthDto);
    return Result.success(info);
  }

  @UseGuards(AuthGuard)
  @Get('/profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Post('/refreshToken')
  async refresh(@Request() req, @Body() refreshDto: RefreshDto) {
    // 头部中获取原始token
    const accessTokenRaw = this.authService.extractTokenFromHeader(req);

    // 获取到刷新后的accessToken
    const accessToken = await this.authService.refreshToken(
      accessTokenRaw,
      refreshDto.refreshToken,
    );

    return Result.success({ accessToken });
  }
}
