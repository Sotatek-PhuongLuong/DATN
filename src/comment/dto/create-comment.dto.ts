import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateCommentInput {
  @IsNotEmpty()
  @ApiProperty({ default: 'phuong.luong@sotatek.com' })
  @IsEmail()
  @MaxLength(200)
  email: string;

  @IsNotEmpty()
  @ApiProperty({ default: 'Phuong.Luong' })
  @IsString()
  name: string;

  @IsNotEmpty()
  @ApiProperty({ default: 'Very good' })
  @IsString()
  description: string;

  @IsNotEmpty()
  @ApiProperty({ default: 5 })
  @IsNumber()
  point: number;

  @IsNotEmpty()
  @ApiProperty({ default: 5 })
  @IsNumber()
  productId: number;
}
