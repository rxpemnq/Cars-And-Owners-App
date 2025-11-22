import { Module } from '@nestjs/common'
import { SessionsService } from './sessions.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Sessions } from './entities/session.entity'
import { CustomSessionStore } from 'src/libs/cookie/session-store'

@Module({
  imports: [TypeOrmModule.forFeature([Sessions])],
  providers: [
    SessionsService,

    {
      provide: CustomSessionStore,
      useFactory: (sessionsService: SessionsService) =>
        new CustomSessionStore(sessionsService),
      inject: [SessionsService]
    }
  ],
  exports: [SessionsService, CustomSessionStore]
})
export class SessionsModule {}
