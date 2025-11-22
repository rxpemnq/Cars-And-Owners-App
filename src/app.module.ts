import { Module } from '@nestjs/common'
import { UserModule } from './users/user.module'
import { UserController } from './users/user.controller'
import { AuthModule } from './auth/auth.module'
import { SessionsModule } from './sessions/sessions.module'
import { AuthController } from './auth/auth.controller'
import { DatabaseModule } from './db/database.module'
import { ConfigModule, ConfigService } from '@nestjs/config'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    AuthModule,
    DatabaseModule,
    UserModule,
    SessionsModule
  ],
  controllers: [UserController, AuthController],
  providers: [
    {
      provide: 'SESSION_CONFIG',
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('SESSION_SECRET'),
        resave: false,
        saveUninitialized: false
      }),
      inject: [ConfigService]
    }
  ]
})
export class AppModule {
  constructor() {}
}
