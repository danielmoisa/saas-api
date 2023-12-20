import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SecurityConfig } from '../../config/configuration.interface';
import { PassportModule } from '@nestjs/passport';
import { PasswordService } from '../../providers/password/password.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => {
        const securityConfig = configService.get<SecurityConfig>('security');
        return {
          secret: 'asdasd',
          signOptions: {
            expiresIn: securityConfig?.expiresIn,
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [AuthResolver, AuthService, PasswordService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
