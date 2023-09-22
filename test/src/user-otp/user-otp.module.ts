import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from 'src/user/user.repository';

import { MailModule } from '../mail/mail.module';
import { UserOtpController } from './user-otp.controller';
import { UserOtpRepository } from './user-otp.repository';
import { UserOtpService } from './user-otp.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserOtpRepository, UserRepository]),
    MailModule,
  ],
  providers: [UserOtpService],
  controllers: [UserOtpController],
  exports: [UserOtpService],
})
export class UserOtpModule {}
