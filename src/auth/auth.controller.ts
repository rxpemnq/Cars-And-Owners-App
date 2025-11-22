import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Injectable,
  InternalServerErrorException,
  Post,
  Request,
  UnauthorizedException,
  UseGuards
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { signSession } from 'src/utils/sign-session/signSession'
import { LocalAuthGuard } from './guards/local-auth.guard'
import { Guard } from './guards/session.guard'
import { CreateUserDto, LoginUserDto } from 'src/users/dto'
import { UserService } from 'src/users/user.service'

@Injectable()
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  @Post('signIn')
  @HttpCode(201)
  @UseGuards(LocalAuthGuard)
  async signIn(@Request() req: any, @Body() loginUserDto: LoginUserDto) {
    const data = await this.authService.signIn({
      email: loginUserDto.email,
      password: loginUserDto.password
    })

    if (!data.ok) {
      throw new UnauthorizedException({
        message: data.message,
        statusCode: 401
      })
    }

    if (data.user) {
      req.session.jwt = await this.authService.createJwtToken({
        userId: data.user?.id,
        roleId: data.user?.roleId
      })
    }

    const sessionId = req.sessionID

    return {
      ok: true,
      user: data?.user?.email,
      sid: signSession(sessionId)
    }
  }

  @Post('signUp')
  @HttpCode(201)
  async signUp(@Request() req: any, @Body() createUserDto: CreateUserDto) {
    const data = await this.authService.signUp({
      name: createUserDto.name,
      password: createUserDto.password,
      phone: createUserDto.phone,
      email: createUserDto.email
    })

    if (data.newUser) {
      req.session.jwt = await this.authService.createJwtToken({
        userId: data.newUser?.id,
        roleId: data.newUser?.roleId
      })
    }

    const sessionId = req.sessionID

    return {
      ok: true,
      message: data.message,
      user: req.body.email,
      sid: signSession(sessionId)
    }
  }

  @Get('logOut')
  @HttpCode(200)
  @UseGuards(Guard)
  async logOut(@Request() req: any) {
    try {
      await req.session.destroy()

      return { ok: true, message: 'Successfully logged out' }
    } catch (err) {
      throw new InternalServerErrorException('Logout failed:', err)
    }
  }

  @Get('profile')
  @HttpCode(200)
  @UseGuards(Guard)
  async getProfile(@Request() req: any) {
    const user = await this.userService.findOneById(req.user.userId)

    if (user) {
      return {
        id: user.id,
        roleId: user.roleId,
        name: user.name,
        email: user.email,
        phone: user.phone,
        cars: user.cars,
        dateCreate: user.dateCreate
      }
    } else {
      throw new BadRequestException({
        ok: false,
        message: 'User not found',
        statusCode: 404
      })
    }
  }
}
