/* eslint-disable @typescript-eslint/unbound-method */
import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, Request } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { IUser } from '../interface'
import { Request as RequestType } from 'express'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken()
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET')
    })
  }

  private static extractJWT(req: RequestType): string | null {
    return req.cookies?.user_token || null
  }

  validate(user: IUser) {
    return { id: user.id, email: user.email, roleId: user.roleId }
  }
}
