import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Mail')
@Controller('mail')
@Controller()
export class MailController {}
