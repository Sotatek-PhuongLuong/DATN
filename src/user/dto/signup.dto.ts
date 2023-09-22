import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class SignupDto {
  @IsEmail({})
  @IsNotEmpty()
  @ApiProperty({
    type: 'email',
    default: 'phuong.luong@sotatek.com',
  })
  email: string;

  @IsEmail({})
  @IsNotEmpty()
  @ApiProperty({
    type: 'email',
    default: 'phuong.luong@sotatek.com',
  })
  username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    default: '123456',
  })
  password: string;

  // @ApiProperty({ default: false })
  // @IsBoolean()
  // isNewLetter: boolean;
}
