import { Module } from '@nestjs/common';
import { MailSenderService } from './mail.service';

@Module({
  providers: [MailSenderService],
  exports: [MailSenderService],
})
export class MailSenderModule {}
