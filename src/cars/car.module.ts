import { Module } from '@nestjs/common'
import { CarService } from './car.service'
import { CarController } from './car.controller'
import { Car } from './entities/car.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserModule } from 'src/users/user.module'
import { AuthModule } from 'src/auth/auth.module'

@Module({
  imports: [TypeOrmModule.forFeature([Car]), UserModule, AuthModule],
  controllers: [CarController],
  providers: [CarService],
  exports: [CarService]
})
export class CarModule {}
