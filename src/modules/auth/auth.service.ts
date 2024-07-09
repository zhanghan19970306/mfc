import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { LoginAuthDto } from './dto/login-auth';
import { Request } from 'express';
import { JwtPayload } from './auth.interface';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(loginAuthDto: LoginAuthDto) {
    const user = await this.userService.findOneByUsername(
      loginAuthDto.username,
    );

    if (user.password !== loginAuthDto.password) {
      throw new UnauthorizedException();
    }

    const payload: JwtPayload = { userId: user.id };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: jwtConstants.accessExpiresIn,
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: jwtConstants.refreshExpiresIn,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
      user,
    };
  }

  /**
   * 在request中解析出 accessToken
   */
  extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  async refreshToken(accessToken: string, refreshToken: string) {
    const [accessResult, refreshResult] = await Promise.allSettled([
      this.jwtService.verifyAsync<JwtPayload>(accessToken),
      this.jwtService.verifyAsync<JwtPayload>(refreshToken),
    ]);

    // 1.accessToken有效的情况下
    if (accessResult.status === 'fulfilled') {
      return accessToken;
    }

    // 2.refreshToken也过期了
    if (refreshResult.status === 'rejected') {
      return '';
    }

    // 3.两个token中的userId不一致
    const { userId: accessUserId } = await this.jwtService.decode(accessToken);
    const userId = refreshResult.value.userId;
    if (accessUserId !== userId) {
      return '';
    }

    // 刷新accessToken
    const newAccessToken = await this.jwtService.signAsync(
      { userId },
      { expiresIn: jwtConstants.accessExpiresIn },
    );

    return newAccessToken;
  }
}
