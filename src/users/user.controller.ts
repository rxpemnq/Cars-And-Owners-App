import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Injectable,
  HttpCode,
  UnprocessableEntityException,
  NotFoundException
} from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto, UpdateUserDto } from './dto'
import { Guard } from 'src/auth/guards/session.guard'
import { Roles } from 'src/decorators/roles-decorator'

@Injectable()
@Controller('user')
@UseGuards(Guard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(201)
  @Roles(0)
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto)
  }

  @Get()
  @HttpCode(200)
  @Roles(0)
  async findAll() {
    const users = await this.userService.findAll()

    if (!users) {
      throw new NotFoundException({
        ok: false,
        message: 'Users not found',
        statusCode: 404
      })
    } else return users
  }

  @Get('/without')
  @HttpCode(200)
  @Roles(0)
  async findAllWithoutCars() {
    const users = await this.userService.findAllWithoutCars()

    if (!users) {
      throw new NotFoundException({
        ok: false,
        message: 'Users not found',
        statusCode: 404
      })
    } else return users
  }

  @Get(':id')
  @HttpCode(200)
  @Roles(0)
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findOneById(+id)

    if (!user) {
      throw new NotFoundException({
        ok: false,
        message: 'User not found',
        statusCode: 404
      })
    } else return user
  }

  @Get('findByEmail/:email')
  @HttpCode(200)
  @Roles(0)
  async findCarsByEmail(@Param('email') email: string) {
    const cars = await this.userService.findCarsByEmail(email)

    if (!cars) {
      throw new NotFoundException({
        ok: false,
        message: 'Cars not found',
        statusCode: 404
      })
    } else return cars
  }

  @Patch(':id')
  @HttpCode(200)
  @Roles(0)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const updateResult = await this.userService.update(+id, updateUserDto)

    const user = await this.userService.findOneById(+id)

    if (updateResult.affected == 1) {
      return { ok: true, message: 'User successfully updated', user }
    } else {
      throw new UnprocessableEntityException({
        ok: false,
        message: 'Cannot update user',
        statusCode: 422
      })
    }
  }

  @Delete(':id')
  @HttpCode(200)
  @Roles(0)
  async remove(@Param('id') id: string) {
    const deleteResult = await this.userService.remove(+id)

    if (deleteResult.affected == 1) {
      return { ok: true, message: 'User successfully deleted' }
    } else {
      throw new UnprocessableEntityException({
        ok: false,
        message: 'Cannot delete user',
        statusCode: 422
      })
    }
  }
}
