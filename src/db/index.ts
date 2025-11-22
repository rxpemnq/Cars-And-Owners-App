import { DataSource } from 'typeorm'
import { ConfigModule } from '@nestjs/config'

void ConfigModule.forRoot()

export default new DataSource({
  type: 'postgres',
  host: 'db',
  port: 5432,
  username: 'root',
  password: 'root',
  database: 'db',
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/db/migrations/*.ts'],
  migrationsTableName: 'migrations'
})
