import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'db',
      port: 5432,
      username: 'root',
      password: 'root',
      database: 'db',
      entities: [],
      synchronize: true,
      dropSchema: process.env.NODE_ENV == 'development' ? true : false
    })
  ],
  controllers: [],
  providers: []
})
export class DatabaseModule {
  constructor() {}
}
