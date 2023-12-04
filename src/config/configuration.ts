export default () => ({
  clientUrl: process.env.CLIENT_URL,
  port: parseInt(process.env.PORT ?? '8080', 10),
  apiHost: process.env.API_HOST,
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT ?? '5432', 10),
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
  },
  jwt: {
    secretOrKey: process.env.JWT_SECRET,
    expiresIn: 86400,
  },
  // You can also use any other email sending services
  mail: {
    service: {
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: false,
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
    senderCredentials: {
      name: process.env.MAIL_SENDER_NAME,
      email: process.env.MAIL_SENDER_EMAIL,
    },
  },
  // Are used in the mail templates
  project: {
    name: '__YOUR_PROJECT_NAME__',
    address: '__YOUR_PROJECT_ADDRESS__',
    logoUrl: 'https://__YOUR_PROJECT_LOGO_URL__',
    slogan: 'Made with ❤️',
    color: '#123456',
    socials: [
      ['GitHub', '__Project_GitHub_URL__'],
      ['__Social_Media_1__', '__Social_Media_1_URL__'],
      ['__Social_Media_2__', '__Social_Media_2_URL__'],
    ],
    url: process.env.CLIENT_URL,
    mailVerificationUrl: `${process.env.API_HOST}:${process.env.PORT}/auth/verify`,
    mailChangeUrl: `${process.env.API_HOST}:${process.env.PORT}/auth/change-email`,
    resetPasswordUrl: `${process.env.CLIENT_URL}/reset-password`,
    termsOfServiceUrl: `${process.env.CLIENT_URL}/legal-terms`,
  },
});
