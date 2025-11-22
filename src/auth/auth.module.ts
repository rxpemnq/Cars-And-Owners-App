import { forwardRef, Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { UserModule } from 'src/users/user.module'
import { AuthController } from './auth.controller'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { LocalStrategy } from './strategies/local.strategy'
import { JwtStrategy } from './strategies/jwt.strategy'
import { PassportModule } from '@nestjs/passport'
import { SessionsModule } from 'src/sessions/sessions.module'
import { Guard } from './guards/session.guard'
import { CustomSessionStore } from 'src/libs/cookie/session-store'

@Module({
  imports: [
    forwardRef(() => UserModule),
    PassportModule,
    SessionsModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '30d' }
      }),
      inject: [ConfigService]
    })
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    CustomSessionStore,
    Guard
  ],
  exports: [AuthService, CustomSessionStore, JwtModule]
})
export class AuthModule {}
