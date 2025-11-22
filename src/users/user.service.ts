import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { Repository } from 'typeorm'
import { CreateUserDto, LoginUserDto, UpdateUserDto } from './dto'
import { comparePassword, hashPassword } from 'src/utils/bcrypt'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existedEmailUser = await this.findOneByEmail(createUserDto.email)
    const existedPhoneUser = await this.findOneByPhone(createUserDto.phone)

    if (existedEmailUser || existedPhoneUser) {
      throw new BadRequestException({
        ok: false,
        message: 'User with this phone or email already exists',
        statusCode: 400
      })
    } else {
      const newUser = await this.userRepository.save({
        name: createUserDto.name,
        password: await hashPassword(createUserDto.password),
        phone: createUserDto.phone,
        email: createUserDto.email,
        roleId: 0
      })

      return {
        ok: true,
        message: 'User successfully registred',
        user: {
          id: newUser.id,
          name: newUser.name,
          phone: newUser.phone,
          email: newUser.email,
          roleId: newUser.roleId,
          dateCreate: newUser.dateCreate
        }
      }
    }
  }

  async loginUser(loginUserDto: LoginUserDto) {
    const user = await this.findOneByEmail(loginUserDto.email)

    if (!user) return null

    const isValid = await comparePassword(loginUserDto.password, user.password)

    if (!isValid) {
      return null
    } else return user
  }

  async findAll() {
    return await this.userRepository.createQueryBuilder('user').getMany()
  }

  async findOneById(id: number): Promise<User | null> {
    return await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .getOne()
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne()
  }

  async findOneByPhone(phone: string): Promise<User | null> {
    return await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.phone = :phone', { phone })
      .getOne()
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return await this.userRepository.update(id, updateUserDto)
  }

  async remove(id: number) {
    return await this.userRepository.delete(id)
  }
}
