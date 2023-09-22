import { Process, Processor } from '@nestjs/bull';
import { MailService } from '@sendgrid/mail';
// import { ConfigService } from '@nestjs/config'
import { Job } from 'bull';
import * as nodemailer from 'nodemailer';

@Processor('send-mail')
export class MailConsumer {
  private transporter;
  readonly _sendGrid: MailService;
  constructor() {
    // this.transporter = nodemailer.createTransport({
    //   host:"smtp-relay.sendinblue.com",
    //   port:465,
    //   pool: true,
    //   secure: true,
    //   auth: {
    //     user: 'luongphuong757@gmail.com',
    //     pass: 'Phuongkya123!'
    //   }
    // })
    this._sendGrid = new MailService();
    this._sendGrid.setApiKey(
      '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',
    );
  }

  @Process('sendMail')
  async sendMail(job: Job<{ mailOptions: any }>) {
    console.log('okee');
    this._sendGrid
      .send(job.data.mailOptions)
      .then(() => {
        console.log('oke');
      })
      .catch((e) => {
        console.log('Error:', e.message);
      });
    return true;
  }
}
