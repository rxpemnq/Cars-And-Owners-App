import { Injectable } from '@nestjs/common'
import { CreateCarDto } from './dto/create-car.dto'
import { UpdateCarDto } from './dto/update-car.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Car } from './entities/car.entity'
import { UserService } from 'src/users/user.service'

@Injectable()
export class CarService {
  constructor(
    @InjectRepository(Car)
    private readonly carRepository: Repository<Car>,
    private readonly userService: UserService
  ) {}

  async create(userId: number, createCarDto: CreateCarDto) {
    const owner = await this.userService.findOneById(userId)

    if (owner) {
      return await this.carRepository.save({
        brand: createCarDto.brand,
        model: createCarDto.model,
        productionYear: createCarDto.productionYear,
        owner
      })
    }
  }

  async findAll() {
    return await this.carRepository
      .createQueryBuilder('car')
      .leftJoinAndSelect('car.owner', 'owner')
      .getMany()
  }

  async findAllByUserId(userId: number) {
    return await this.carRepository
      .createQueryBuilder('car')
      .where('car.userId = :userId', { userId })
      .leftJoinAndSelect('car.owner', 'owner')
      .getMany()
  }

  async findAllWithoutOwners() {
    return await this.carRepository
      .createQueryBuilder('car')
      .where('car.owner IS NULL')
      .getMany()
  }

  async findCarsByBrand(brand: string) {
    return await this.carRepository
      .createQueryBuilder('car')
      .where('car.brand = :brand', { brand })
      .getMany()
  }

  async findOneById(id: number) {
    return await this.carRepository
      .createQueryBuilder('car')
      .leftJoinAndSelect('car.owner', 'owner')
      .where('car.id = :id', { id })
      .getOne()
  }

  async update(id: number, updateCarDto: UpdateCarDto) {
    return await this.carRepository.update(id, updateCarDto)
  }

  async remove(id: number) {
    return await this.carRepository.delete(id)
  }
}
