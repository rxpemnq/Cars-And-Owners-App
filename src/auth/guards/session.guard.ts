import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common'
import { CustomSessionStore } from 'src/libs/cookie/session-store'
import { Reflector } from '@nestjs/core'
import { ROLES_KEY } from 'src/decorators/roles-decorator'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class Guard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly customSessionStore: CustomSessionStore,
    private jwtService: JwtService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isValid = await this.checkAuth(context)

    if (isValid) {
      return true
    } else {
      throw new UnauthorizedException('Invalid or expired session')
    }
  }

  async checkAuth(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()

    const { sessionID, session } = request

    if (!sessionID || !session.cookie._expires) {
      return false
    }

    const now = Date.now()
    const expires = new Date(session.cookie._expires).getTime()

    if (now >= expires) {
      await this.customSessionStore.destroy(sessionID)
      return false
    }

    if (!session.jwt) {
      return false
    }

    const token = session.jwt

    if (!token) {
      throw new UnauthorizedException()
    }

    const payload = await this.jwtService.verifyAsync(token, {
      secret: process.env.JWT_SECRET
    })

    const requiredRoles =
      this.reflector.get<number[]>(ROLES_KEY, context.getHandler()) || []

    if (requiredRoles.length == 0 || requiredRoles.includes(payload.roleId)) {
      request['user'] = payload

      return true
    } else {
      return false
    }
  }
}
