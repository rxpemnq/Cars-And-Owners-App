jest.mock('src/utils/sign-session/signSession', () => ({
  signSession: jest.fn().mockReturnValue('mocked-sessionID')
}))

import { Test, TestingModule } from '@nestjs/testing'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { User } from 'src/users/entities/user.entity'
import { signSession } from 'src/utils/sign-session/signSession'

describe('auth', () => {
  let authController: AuthController
  let authService: AuthService

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signIn: jest.fn(),
            signUp: jest.fn(),
            login: jest.fn()
          }
        }
      ]
    }).compile()

    authController = moduleRef.get<AuthController>(AuthController)
    authService = moduleRef.get<AuthService>(AuthService)
  })

  describe('signIn', () => {
    it('should sign user and return sign data', async () => {
      const req = {
        body: {
          email: 'email@email.com',
          password: '1234567890'
        },
        session: {
          user: ''
        },
        sessionID: 'sessionID'
      }

      const user = {
        id: '1',
        name: 'Ivan',
        password: '1234567890',
        phone: '88005553535',
        email: 'email@email.com',
        roleId: 1,
        cars: [],
        dateCreate: '2025-10-09 11:42:26.105'
      } as unknown as User

      jest.spyOn(authService, 'signIn').mockResolvedValue(user)

      expect(await authController.signIn(req)).toEqual({
        ok: true,
        user: 'email@email.com',
        sid: 'mocked-sessionID'
      })

      expect(signSession).toHaveBeenCalledWith('sessionID')
    })
  })

  describe('signUp', () => {
    it('should register user and return signUp data', async () => {
      const req = {
        body: {
          name: 'Ivan',
          email: 'email@email.com',
          password: '1234567890',
          phone: '88005553535'
        },
        session: {
          user: ''
        },
        sessionID: 'sessionID'
      }

      const data = {
        ok: true,
        message: 'success',
        user: {
          id: '1',
          name: 'Ivan',
          password: '1234567890',
          phone: '88005553535',
          email: 'email@email.com',
          roleId: 1,
          cars: [],
          dateCreate: '2025-10-09 11:42:26.105'
        } as unknown as User
      }

      jest.spyOn(authService, 'signUp').mockResolvedValue(data)

      expect(await authController.signUp(req)).toEqual({
        ok: true,
        message: 'success',
        user: 'email@email.com',
        sid: 'mocked-sessionID'
      })

      expect(signSession).toHaveBeenCalledWith('sessionID')
    })
  })

  describe('logOut', () => {
    it('should destroy session and return success message', async () => {
      const req: any = {
        session: {
          destroy: jest.fn().mockImplementation((cb) => cb && cb(null))
        }
      }

      expect(await authController.logOut(req)).toEqual({
        ok: true,
        message: 'Successfully logged out'
      })

      expect(req.session.destroy).toHaveBeenCalled()
    })
  })
})
