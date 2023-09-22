import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserOtp } from 'entities/user-otp.entity';
import { ErrorDto } from 'src/shared/dto/response/error.dto';
import { ResultDto } from 'src/shared/dto/response/result.dto';
import { JwtAuthGuard } from 'src/user/guards/jwt-auth.guard';
import { CreateUserOtpDto } from './dtos/create-user-otp.dto';
// import { ErrorDto } from './dtos/response/error.dto';
// import { ResultDto } from './dtos/response/result.dto';
import { VerifyOtpDto } from './dtos/verify-otp.dto';
import { UserOtpService } from './user-otp.service';

@ApiTags('User Otp')
@Controller('user-otp')
export class UserOtpController {
  constructor(private readonly userOtpService: UserOtpService) {}

  @Post()
  @ApiOperation({
    summary: 'Create user OTP by Type',
  })
  @ApiOkResponse({ description: 'Success', type: ResultDto })
  @ApiBadRequestResponse({ description: 'Fail', type: ErrorDto })
  async createUserOtpByType(@Query() query: CreateUserOtpDto) {
    return await this.userOtpService.getOTPbyType(query);
  }

  @Post('/verify-otp')
  // @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Verify otp code email and type',
  })
  // @ApiResponse({
  //   status: HttpStatus.OK
  // })
  @ApiBadRequestResponse({ description: 'Fail', type: ErrorDto })
  async verifyOtpById(@Body() dto: VerifyOtpDto) {
    const data = await this.userOtpService.verifyOtp(dto);
    return data;
  }
}
