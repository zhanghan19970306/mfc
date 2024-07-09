import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { LoginAuthDto } from './dto/login-auth';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(signInDto: LoginAuthDto) {
    const user = await this.userService.findOneByUsername(signInDto.username);

    if (user.password !== signInDto.password) {
      throw new UnauthorizedException();
    }

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { userId: user.id, username: user.username },
        { expiresIn: '2h' },
      ),
      this.jwtService.signAsync(
        { userId: user.id, username: user.username },
        { expiresIn: '30 days' },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
      userInfo: user,
    };
  }
}
