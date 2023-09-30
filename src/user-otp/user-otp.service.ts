import { BadRequestException, Injectable } from '@nestjs/common';
import { MailService } from 'src/mail/mail.service';
// import { MailService } from '@sendgrid/mail'
import { UserRepository } from 'src/user/user.repository';
import { OTP_TYPE, STATUS_OTP } from './constants';
// import { OTP_TYPE, STATUS_OTP } from './constants'
import { CreateUserOtpDto } from './dtos/create-user-otp.dto';
import { VerifyOtpDto } from './dtos/verify-otp.dto';
// import { UserOtpRepository } from './user-otp.repository';

@Injectable()
export class UserOtpService {
  constructor(
    // private repository: UserOtpRepository,
    private readonly mailService: MailService,
    private readonly userRepo: UserRepository,
  ) {}

  async getOTPbyType(userOtpDto: CreateUserOtpDto) {
    // if (userOtpDto.otpType === OTP_TYPE.CHANGE_PASS) {
    // const user = await this.userRepo.findOne({
    //   where: {
    //     email: userOtpDto.email
    //   }
    // })
    // if (!user) {
    //   throw new BadRequestException('email_does_not_exist')
    // }
    // }s

    // const userWhiteList = await this.checkUserWallet(userOtpDto.email)
    // if (!userWhiteList) {
    //   throw new BadRequestException(MsgHelper.MsgList.email_not_support)
    // }
    const code = Math.floor(100000 + Math.random() * 900000);
    const expiredSeconds = process.env.OTP_EXPIRED;
    const expiredAt =
      Math.round(new Date().getTime() / 1000) + parseInt(expiredSeconds);
    await this.mailService.sendMail(userOtpDto.email, 'OTP CODE FROM DATN', {
      code,
    });
    // await this.repository.save({
    //   email: userOtpDto.email,
    //   code,
    //   type: userOtpDto.otpType ?? OTP_TYPE.SIGN_UP,
    //   status: STATUS_OTP.WAIT_VERIFY,
    //   expiredAt,
    // });
    return {
      message: 'Sent otp code to email.',
    };
  }

  async verifyOtp(dto: VerifyOtpDto): Promise<string> {
    // if change pass type then need check user exist inside database
    if (dto.otpType === OTP_TYPE.CHANGE_PASS) {
      const hasEmail = await this.userRepo.findOne({
        where: {
          email: dto.email,
        },
      });
      if (!hasEmail) {
        throw new BadRequestException('email_does_not_exist');
      }
    }

    // const userOtp = await this.repository.findOne({
    //   where: {
    //     email: dto.email,
    //     type: dto.otpType,
    //     status: STATUS_OTP.WAIT_VERIFY,
    //   },
    //   order: {
    //     createdAt: 'DESC',
    //   },
    // });
    // if (!userOtp || dto.otp !== userOtp.code) {
    //   throw new BadRequestException('invalid_code');
    // } else if (new Date().getTime() / 1000 > userOtp.expiredAt) {
    //   throw new BadRequestException('otp_expired');
    // }
    // await this.repository.save({ id: userOtp.id, status: STATUS_OTP.VERIFIED });
    return 'success';
  }

  // async verifedOtpById(dto: VerifyOtpDto): Promise<string> {
  //   const userOtp = await this.repository.findOne({
  //     where: {
  //       email: dto.email,
  //       type: dto.otpType,
  //       status: STATUS_OTP.VERIFIED,
  //       code: dto.otp,
  //     },
  //     order: {
  //       createdAt: 'DESC',
  //     },
  //   });

  //   if (userOtp) {
  //     return 'Success';
  //   }
  //   return 'Fail';
  // }
}
