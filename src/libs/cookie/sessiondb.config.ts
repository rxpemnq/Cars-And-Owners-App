import { SessionOptions } from 'express-session'
import { CustomSessionStore } from './session-store'

export function createSessionConfig(
  sessionStore: CustomSessionStore
): SessionOptions {
  return {
    name: 'sid',
    secret: process.env.SESSION_SECRET || 'keyboard cat',
    saveUninitialized: false,
    resave: false,
    proxy: true,
    store: sessionStore,
    cookie:
      process.env.NODE_ENV === 'development'
        ? {
            path: '/',
            httpOnly: false,
            maxAge: 2592000000
            // domain: 'localhost'
          }
        : {
            path: '/',
            httpOnly: false,
            maxAge: 2592000000
            // domain: 'localhost'
          }
  }
}
