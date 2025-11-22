import { Injectable } from '@nestjs/common'
import { UserService } from 'src/users/user.service'
import { JwtService } from '@nestjs/jwt'
import { comparePassword } from 'src/utils/bcrypt'
import { CreateUserDto, LoginUserDto } from 'src/users/dto'

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async signIn(loginUserDto: LoginUserDto): Promise<any> {
    const user = await this.userService.findOneByEmail(loginUserDto.email)

    if (user && (await comparePassword(loginUserDto.password, user.password))) {
      return {
        ok: true,
        message: 'Successfully logged in',
        user
      }
    } else {
      return {
        ok: false,
        message: 'User or password arent valid',
        user
      }
    }
  }

  async signUp(createUserDto: CreateUserDto) {
    const newUser = await this.userService.create(createUserDto)

    return {
      ok: newUser.ok,
      message: newUser.message,
      newUser: newUser.user
    }
  }

  async createJwtToken(data: any) {
    return await this.jwtService.signAsync(data)
  }
}
