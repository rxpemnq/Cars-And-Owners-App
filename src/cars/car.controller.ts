import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  Injectable,
  UnprocessableEntityException,
  NotFoundException,
  Req
} from '@nestjs/common'
import { CarService } from './car.service'
import { CreateCarDto, UpdateCarDto } from './dto'
import { Roles } from 'src/decorators/roles-decorator'
import { Guard } from 'src/auth/guards/session.guard'

@Injectable()
@Controller('car')
@UseGuards(Guard)
export class CarController {
  constructor(private readonly carService: CarService) {}

  @Post()
  @HttpCode(201)
  @Roles(0)
  async create(@Req() req: any, @Body() createCarDto: CreateCarDto) {
    const car = await this.carService.create(req.user.userId, createCarDto)

    if (!car) {
      throw new UnprocessableEntityException({
        ok: false,
        message: 'Cannot create car',
        statusCode: 422
      })
    }

    return { ok: true, message: 'car successfully created', car }
  }

  @Get()
  @HttpCode(200)
  @Roles(0)
  async findAll() {
    const cars = await this.carService.findAll()

    if (cars.length == 0) {
      throw new NotFoundException({
        ok: false,
        message: 'Cannot find cars',
        stausCode: 404
      })
    } else return cars
  }

  @Get('/myCars')
  @HttpCode(200)
  @Roles(0)
  async findAllByUserId(@Req() req: any) {
    const cars = await this.carService.findAllByUserId(req.user.userId)

    if (cars.length == 0) {
      throw new NotFoundException({
        ok: false,
        message: 'Cannot find cars',
        stausCode: 404
      })
    }

    return cars
  }

  @Get('/without')
  @HttpCode(200)
  @Roles(0)
  async findAllWithoutOwners() {
    const cars = await this.carService.findAllWithoutOwners()

    if (cars.length == 0) {
      throw new NotFoundException({
        ok: false,
        message: 'Cannot find cars',
        stausCode: 404
      })
    }

    return cars
  }

  @Get(':brand')
  @HttpCode(200)
  @Roles(0)
  async findAllByBrand(@Param('brand') brand: string) {
    const cars = await this.carService.findCarsByBrand(brand)

    if (cars.length == 0) {
      throw new NotFoundException({
        ok: false,
        message: 'Cannot find cars',
        stausCode: 404
      })
    }

    return cars
  }

  @Get('/getOneById/:id')
  @HttpCode(200)
  @Roles(0)
  async findOneById(@Param('id') id: string) {
    const car = await this.carService.findOneById(+id)

    if (!car) {
      throw new NotFoundException({
        ok: false,
        message: 'Cannot find car',
        stausCode: 404
      })
    }

    return car
  }

  @Patch(':id')
  @HttpCode(200)
  @Roles(0)
  async update(@Param('id') id: string, @Body() updateCarDto: UpdateCarDto) {
    const updateResult = await this.carService.update(+id, updateCarDto)

    if (updateResult.affected == 1) {
      return { ok: true, message: 'Car successfully updated' }
    } else {
      throw new UnprocessableEntityException({
        ok: false,
        message: 'Cannot update car',
        statusCode: 422
      })
    }
  }

  @Delete(':id')
  @HttpCode(200)
  @Roles(0)
  async remove(@Param('id') id: string) {
    const deleteResult = await this.carService.remove(+id)

    if (deleteResult.affected == 1) {
      return { ok: true, message: 'Car successfully deleted' }
    } else {
      throw new UnprocessableEntityException({
        ok: false,
        message: 'Cannot delete car',
        statusCode: 422
      })
    }
  }
}
