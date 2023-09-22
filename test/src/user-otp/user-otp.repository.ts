import { NotFoundException } from '@nestjs/common';
import { UserOtp } from 'entities/user-otp.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(UserOtp)
export class UserOtpRepository extends Repository<UserOtp> {
  async getById(id: number): Promise<UserOtp> {
    const userOtp = await this.findOne({ where: { id } });
    if (!userOtp) {
      throw new NotFoundException();
    }
    return userOtp;
  }
}
