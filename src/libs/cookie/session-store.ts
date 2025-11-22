/* eslint-disable @typescript-eslint/no-misused-promises */
import { Injectable } from '@nestjs/common'
import * as session from 'express-session'
import { SessionsService } from 'src/sessions/sessions.service'

@Injectable()
export class CustomSessionStore extends session.Store {
  constructor(private readonly sessionsService: SessionsService) {
    super()
    this.set = this.set.bind(this)
    this.get = this.get.bind(this)
    this.destroy = this.destroy.bind(this)
  }

  async get(
    sid: string,
    callback: (err: any, session?: session.SessionData | null) => void
  ): Promise<void> {
    const response = await this.sessionsService.readSession({ sid: sid })

    if (!response) return callback(null, null)

    const dateNow = Math.round(Date.now() / 1000)

    if (response.expires < dateNow) return callback(null, null)

    const data = response.session

    return callback(null, JSON.parse(data))
  }

  async set(
    sid: string,
    session: session.SessionData,
    callback?: (err?: any) => void
  ): Promise<void> {
    let expires

    if (session.cookie) {
      if (session.cookie.expires) {
        expires = session.cookie.expires
      }
    }

    if (!expires) {
      expires = Date.now()
    }

    if (!(expires instanceof Date)) {
      expires = new Date(expires)
    }

    expires = Math.round(expires.getTime() / 1000)
    const data = JSON.stringify(session)

    await this.sessionsService.createSession({
      sid,
      expires,
      session: data
    })

    if (callback) {
      callback()
    }
  }

  async destroy(sid: string): Promise<void> {
    await this.sessionsService.deleteSession({ sid: sid })
  }
}
