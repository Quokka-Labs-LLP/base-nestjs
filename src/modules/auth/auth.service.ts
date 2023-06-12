import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../common/models/user.schema';
import { SignupDto, LoginDto } from './dto/auth.dto';
import * as argon2 from 'argon2';
import { JwtPayload } from '@interfaces/Auth/jwtpayload.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginResponse } from './responses/login.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  async signup(data: SignupDto) {
    const { email, password, firstName, lastName } = data;
    const hashedPassword = await argon2.hash(password);
    return await this.userModel.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });
  }

  async login(data: LoginDto): Promise<LoginResponse> {
    const { email, password } = data;
    const user = await this.userModel.findOne({ email });
    if (user && (await argon2.verify(user.password, password))) {
      const { _id, email, firstName, lastName } = user;
      const payload: JwtPayload = {
        userId: _id.toString(),
        email,
        firstName,
        lastName,
      };
      const { accessToken, refreshToken, hashedRefreshToken } =
        await this.generateTokens(payload);
      await this.userModel.findByIdAndUpdate(_id, {
        refreshToken: hashedRefreshToken,
      });
      return {
        userId: _id.toString(),
        email,
        firstName,
        lastName,
        accessToken,
        refreshToken,
      };
    } else
      throw new UnauthorizedException('Please check your login credentials');
  }

  async refreshTokens(userId: string, refreshToken: string): Promise<string> {
    const user: any = await this.userModel.findById(userId);
    if (
      !user ||
      !user.refreshToken ||
      !(await argon2.verify(user.refreshToken, refreshToken))
    )
      throw new ForbiddenException('Access Denied');
    const { _id, email, firstName, lastName } = user;
    const payload = { userId: _id.toString(), email, firstName, lastName };
    const { accessToken } = await this.generateTokens(payload);
    return accessToken;
  }

  async generateTokens(payload: JwtPayload): Promise<{
    accessToken: string;
    refreshToken: string;
    hashedRefreshToken: string;
  }> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get('JWT_TOKEN_EXPIRATION'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
        expiresIn: this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION'),
      }),
    ]);
    const hashedRefreshToken = await argon2.hash(refreshToken);
    return { accessToken, refreshToken, hashedRefreshToken };
  }
}
