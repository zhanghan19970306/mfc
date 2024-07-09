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

    const accessToken = await this.jwtService.signAsync({
      userId: user.id,
      username: user.username,
    });

    return {
      accessToken,
      userInfo: user,
    };
  }
}
