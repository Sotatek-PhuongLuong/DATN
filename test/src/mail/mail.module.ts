import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config'

import { MailConsumer } from './mail.consumer';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'send-mail',
    }),
  ],
  controllers: [MailController],
  providers: [MailService, MailConsumer],
  exports: [MailService],
})
export class MailModule {}
