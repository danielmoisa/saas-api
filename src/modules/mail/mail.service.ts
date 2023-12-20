import { Injectable, Logger } from '@nestjs/common';
import { createTransport } from 'nodemailer';
import * as Mail from 'nodemailer/lib/mailer';

import {
  changeMail,
  changePasswordInfo,
  confirmMail,
  resetPassword,
} from './templates';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailSenderService {
  private transporter: Mail;
  private socials: string;
  private logger = new Logger('MailSenderService');

  constructor(private readonly config: ConfigService) {
    this.transporter = createTransport({
      auth: {
        user: this.config.getOrThrow('mail.service.user'),
        pass: this.config.getOrThrow('mail.service.pass'),
      },
      host: this.config.getOrThrow('mail.service.host'),
      port: this.config.getOrThrow('mail.service.port'),
      secure: this.config.getOrThrow('mail.service.secure'),
    });
    this.socials = this.config
      .getOrThrow('project.socials')
      .map(
        (social: string[]) =>
          `<a href="${
            social[1]
          }" style="box-sizing:border-box;color:${this.config.getOrThrow(
            'project.color',
          )};font-weight:400;text-decoration:none;font-size:12px;padding:0 5px" target="_blank">${
            social[0]
          }</a>`,
      )
      .join('');
  }

  async sendVerifyEmailMail(
    name: string,
    email: string,
    token: string,
  ): Promise<boolean> {
    const buttonLink = `${this.config.getOrThrow(
      'project.mailVerificationUrl',
    )}?token=${token}`;

    const mail = confirmMail
      .replace(new RegExp('--PersonName--', 'g'), name)
      .replace(
        new RegExp('--ProjectName--', 'g'),
        this.config.getOrThrow('project.name'),
      )
      .replace(
        new RegExp('--ProjectAddress--', 'g'),
        this.config.getOrThrow('project.address'),
      )
      .replace(
        new RegExp('--ProjectLogo--', 'g'),
        this.config.getOrThrow('project.logoUrl'),
      )
      .replace(
        new RegExp('--ProjectSlogan--', 'g'),
        this.config.getOrThrow('project.slogan'),
      )
      .replace(
        new RegExp('--ProjectColor--', 'g'),
        this.config.getOrThrow('project.color'),
      )
      .replace(
        new RegExp('--ProjectLink--', 'g'),
        this.config.getOrThrow('project.url'),
      )
      .replace(new RegExp('--Socials--', 'g'), this.socials)
      .replace(new RegExp('--ButtonLink--', 'g'), buttonLink)
      .replace(
        new RegExp('--TermsOfServiceLink--', 'g'),
        this.config.getOrThrow('project.termsOfServiceUrl'),
      );

    const mailOptions = {
      from: `"${this.config.getOrThrow(
        'mail.senderCredentials.name',
      )}" <${this.config.getOrThrow('mail.senderCredentials.email')}>`,
      to: email, // list of receivers (separated by ,)
      subject: `Welcome to ${this.config.getOrThrow(
        'project.name',
      )} ${name}! Confirm Your Email`,
      html: mail,
    };

    return new Promise<boolean>((resolve) =>
      this.transporter.sendMail(mailOptions, async (error) => {
        if (error) {
          this.logger.warn(
            'Mail sending failed, check your service credentials.',
          );
          resolve(false);
        }
        resolve(true);
      }),
    );
  }

  async sendChangeEmailMail(
    name: string,
    email: string,
    token: string,
  ): Promise<boolean> {
    const buttonLink = `${this.config.getOrThrow(
      'project.mailChangeUrl',
    )}?token=${token}`;

    const mail = changeMail
      .replace(new RegExp('--PersonName--', 'g'), name)
      .replace(
        new RegExp('--ProjectName--', 'g'),
        this.config.getOrThrow('project.name'),
      )
      .replace(
        new RegExp('--ProjectAddress--', 'g'),
        this.config.getOrThrow('project.address'),
      )
      .replace(
        new RegExp('--ProjectLogo--', 'g'),
        this.config.getOrThrow('project.logoUrl'),
      )
      .replace(
        new RegExp('--ProjectSlogan--', 'g'),
        this.config.getOrThrow('project.slogan'),
      )
      .replace(
        new RegExp('--ProjectColor--', 'g'),
        this.config.getOrThrow('project.color'),
      )
      .replace(
        new RegExp('--ProjectLink--', 'g'),
        this.config.getOrThrow('project.url'),
      )
      .replace(new RegExp('--Socials--', 'g'), this.socials)
      .replace(new RegExp('--ButtonLink--', 'g'), buttonLink);

    const mailOptions = {
      from: `"${this.config.getOrThrow(
        'mail.senderCredentials.name',
      )}" <${this.config.getOrThrow('mail.senderCredentials.email')}>`,
      to: email, // list of receivers (separated by ,)
      subject: `Change Your ${this.config.getOrThrow(
        'project.name',
      )} Account's Email`,
      html: mail,
    };

    return new Promise<boolean>((resolve) =>
      this.transporter.sendMail(mailOptions, async (error) => {
        if (error) {
          this.logger.warn(
            'Mail sending failed, check your service credentials.',
          );
          resolve(false);
        }
        resolve(true);
      }),
    );
  }

  async sendResetPasswordMail(
    name: string,
    email: string,
    token: string,
  ): Promise<boolean> {
    const buttonLink = `${this.config.getOrThrow(
      'project.resetPasswordUrl',
    )}?token=${token}`;

    const mail = resetPassword
      .replace(new RegExp('--PersonName--', 'g'), name)
      .replace(
        new RegExp('--ProjectName--', 'g'),
        this.config.getOrThrow('project.name'),
      )
      .replace(
        new RegExp('--ProjectAddress--', 'g'),
        this.config.getOrThrow('project.address'),
      )
      .replace(
        new RegExp('--ProjectLogo--', 'g'),
        this.config.getOrThrow('project.logoUrl'),
      )
      .replace(
        new RegExp('--ProjectSlogan--', 'g'),
        this.config.getOrThrow('project.slogan'),
      )
      .replace(
        new RegExp('--ProjectColor--', 'g'),
        this.config.getOrThrow('project.color'),
      )
      .replace(
        new RegExp('--ProjectLink--', 'g'),
        this.config.getOrThrow('project.url'),
      )
      .replace(new RegExp('--Socials--', 'g'), this.socials)
      .replace(new RegExp('--ButtonLink--', 'g'), buttonLink);

    const mailOptions = {
      from: `"${this.config.getOrThrow(
        'mail.senderCredentials.name',
      )}" <${this.config.getOrThrow('mail.senderCredentials.email')}>`,
      to: email, // list of receivers (separated by ,)
      subject: `Reset Your ${this.config.getOrThrow(
        'project.name',
      )} Account's Password`,
      html: mail,
    };

    return new Promise<boolean>((resolve) =>
      this.transporter.sendMail(mailOptions, async (error) => {
        if (error) {
          this.logger.warn(
            'Mail sending failed, check your service credentials.',
          );
          resolve(false);
        }
        resolve(true);
      }),
    );
  }

  async sendPasswordChangeInfoMail(
    name: string,
    email: string,
  ): Promise<boolean> {
    const buttonLink = this.config.getOrThrow('project.url');
    const mail = changePasswordInfo
      .replace(new RegExp('--PersonName--', 'g'), name)
      .replace(
        new RegExp('--ProjectName--', 'g'),
        this.config.getOrThrow('project.name'),
      )
      .replace(
        new RegExp('--ProjectAddress--', 'g'),
        this.config.getOrThrow('project.address'),
      )
      .replace(
        new RegExp('--ProjectLogo--', 'g'),
        this.config.getOrThrow('project.logoUrl'),
      )
      .replace(
        new RegExp('--ProjectSlogan--', 'g'),
        this.config.getOrThrow('project.slogan'),
      )
      .replace(
        new RegExp('--ProjectColor--', 'g'),
        this.config.getOrThrow('project.color'),
      )
      .replace(
        new RegExp('--ProjectLink--', 'g'),
        this.config.getOrThrow('project.url'),
      )
      .replace(new RegExp('--Socials--', 'g'), this.socials)
      .replace(new RegExp('--ButtonLink--', 'g'), buttonLink);

    const mailOptions = {
      from: `"${this.config.getOrThrow(
        'mail.senderCredentials.name',
      )}" <${this.config.getOrThrow('mail.senderCredentials.email')}>`,
      to: email, // list of receivers (separated by ,)
      subject: `Your ${this.config.getOrThrow(
        'project.name',
      )} Account's Password is Changed`,
      html: mail,
    };

    return new Promise<boolean>((resolve) =>
      this.transporter.sendMail(mailOptions, async (error) => {
        if (error) {
          this.logger.warn(
            'Mail sending failed, check your service credentials.',
          );
          resolve(false);
        }
        resolve(true);
      }),
    );
  }
}
