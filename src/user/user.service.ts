import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from 'entities/user.entity';
import { OTP_TYPE } from 'src/user-otp/constants';
import { UserOtpService } from 'src/user-otp/user-otp.service';
import { SignupDto } from './dto/signup.dto';
import { UserRepository } from './user.repository';
import { compare, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private userOtpService: UserOtpService,
    private jwtService: JwtService,
  ) {}
  async signup(signupDto: SignupDto): Promise<User> {
    const { email, password, userName, address, avatar, phoneNumber } = signupDto;
    const user = await this.findByEmail(signupDto.email);
    if (user) {
      throw new BadRequestException('email_already_exist');
    }
    // await this.userOtpService.verifyOtp({
    //   otp: signupDto.otp,
    //   email: signupDto.email,
    //   otpType: OTP_TYPE.SIGN_UP,
    // });

    if (!user) {
      return this.userRepository.save({
        email: email,
        roles: 'USER',
        password: await hash(password, 10),
        userName,
        address,
        phoneNumber,
        avatar
      });
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });
    return user;
  }

  async getUser(email: string, password: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user || (user && !user.password)) {
      throw new UnauthorizedException('email_does_not_exist');
    }
    const match = await compare(password, user.password);
    if (!match) throw new UnauthorizedException('incorrect_email_password');

    return user;
  }

  async login(user: User) {
    const payload = {
      username: user.userName,
      sub: user.id,
      roles: user.roles,
    };

    const subject = { sub: user.id };
    const authToken = {
      refreshToken: this.jwtService.sign(subject, {
        secret: process.env.JWT_SECRET_KEY,
        expiresIn: process.env.JWT_REFRESH_TOKEN_EXP_IN_SEC,
      }),
      accessToken: this.jwtService.sign(
        {
          ...payload,
          ...subject,
        },
        {
          secret: process.env.JWT_SECRET_KEY,
          expiresIn: process.env.JWT_ACCESS_TOKEN_EXP_IN_SEC,
        },
      ),
    };

    return authToken;
  }

  decodeToken(token: string) {
    return this.jwtService.decode(token);
  }

  async getUserProfile(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    return user;
  }
}
