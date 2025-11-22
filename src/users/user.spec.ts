import { Test, TestingModule } from '@nestjs/testing'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { ValidationPipe } from '@nestjs/common'
import { APP_PIPE } from '@nestjs/core'
import { User } from 'src/users/entities/user.entity'
import { DeleteResult, UpdateResult } from 'typeorm'
import { CreateUserDto } from './dto'

describe('UserController', () => {
  let userController: UserController
  let userService: UserService

  const pipe = new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true
  })

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            create: jest.fn(),
            loginUser: jest.fn(),
            findAll: jest.fn(),
            findAllWithoutCars: jest.fn(),
            findCarsByEmail: jest.fn(),
            findOneById: jest.fn(),
            findOneByEmail: jest.fn(),
            update: jest.fn(),
            remove: jest.fn()
          }
        },
        {
          provide: APP_PIPE,
          useValue: new ValidationPipe({ whitelist: true })
        }
      ]
    }).compile()

    userController = moduleRef.get<UserController>(UserController)
    userService = moduleRef.get<UserService>(UserService)
  })

  describe('create', () => {
    it('should create user', async () => {
      const createUserDto = {
        name: 'Ivan',
        password: '1234567890',
        phone: '88005553535',
        email: 'email@email.com'
      }

      const user = {
        id: '1',
        ...createUserDto,
        roleId: 1,
        cars: [],
        dateCreate: '2025-10-09 11:42:26.105'
      } as unknown as any

      jest.spyOn(userService, 'create').mockResolvedValue(user)

      expect(await userController.create(createUserDto)).toBe(user)
    })

    it('should throw validation error if name is empty', async () => {
      const invalidDto = {
        name: '',
        password: '1234567890',
        phone: '88005553535',
        email: 'email@email.com'
      }

      try {
        const validatedDto = await pipe.transform(invalidDto, {
          type: 'body',
          metatype: CreateUserDto
        })

        await userController.create(validatedDto)
        fail('Validation should have thrown an error')
      } catch (err) {
        const response = err.getResponse ? err.getResponse() : err
        const message =
          typeof response === 'object' ? response.message : response

        expect(message).toEqual(
          expect.arrayContaining(['Name field cannot be empty'])
        )
      }
    })

    it('should throw validation error if name is not a string', async () => {
      const invalidDto = {
        name: 123 as any,
        password: '1234567890',
        phone: '88005553535',
        email: 'email@email.com'
      }

      try {
        const validatedDto = await pipe.transform(invalidDto, {
          type: 'body',
          metatype: CreateUserDto
        })

        await userController.create(validatedDto)
        fail('Validation should have thrown an error')
      } catch (err) {
        const response = err.getResponse ? err.getResponse() : err
        const message =
          typeof response === 'object' ? response.message : response

        expect(message).toEqual(
          expect.arrayContaining(['Name should only be a string'])
        )
      }
    })

    it('should throw validation error if password is less than 8 symbols', async () => {
      const invalidDto = {
        name: 'Ivan',
        password: '123456',
        phone: '88005553535',
        email: 'email@email.com'
      }

      try {
        const validatedDto = await pipe.transform(invalidDto, {
          type: 'body',
          metatype: CreateUserDto
        })

        await userController.create(validatedDto)
        fail('Validation should have thrown an error')
      } catch (err) {
        const response = err.getResponse ? err.getResponse() : err
        const message =
          typeof response === 'object' ? response.message : response

        expect(message).toEqual(
          expect.arrayContaining(['Minimal lenght of password is 8 symbols'])
        )
      }
    })

    it('should throw validation error if password is more than 24 symbols', async () => {
      const invalidDto = {
        name: 'Ivan',
        password: '123456123456123456123456123456',
        phone: '88005553535',
        email: 'email@email.com'
      }

      try {
        const validatedDto = await pipe.transform(invalidDto, {
          type: 'body',
          metatype: CreateUserDto
        })

        await userController.create(validatedDto)
        fail('Validation should have thrown an error')
      } catch (err) {
        const response = err.getResponse ? err.getResponse() : err
        const message =
          typeof response === 'object' ? response.message : response

        expect(message).toEqual(
          expect.arrayContaining(['Maximum lenght of password is 24 symbols'])
        )
      }
    })

    it('should throw validation error if password is empty', async () => {
      const invalidDto = {
        name: 'Ivan',
        password: '',
        phone: '88005553535',
        email: 'email@email.com'
      }

      try {
        const validatedDto = await pipe.transform(invalidDto, {
          type: 'body',
          metatype: CreateUserDto
        })

        await userController.create(validatedDto)
        fail('Validation should have thrown an error')
      } catch (err) {
        const response = err.getResponse ? err.getResponse() : err
        const message =
          typeof response === 'object' ? response.message : response

        expect(message).toEqual(
          expect.arrayContaining(['Password field cannot be empty'])
        )
      }
    })

    it('should throw validation error if phone is empty', async () => {
      const invalidDto = {
        name: 'Ivan',
        password: '1234567890',
        phone: '',
        email: 'email@email.com'
      }

      try {
        const validatedDto = await pipe.transform(invalidDto, {
          type: 'body',
          metatype: CreateUserDto
        })

        await userController.create(validatedDto)
        fail('Validation should have thrown an error')
      } catch (err) {
        const response = err.getResponse ? err.getResponse() : err
        const message =
          typeof response === 'object' ? response.message : response

        expect(message).toEqual(
          expect.arrayContaining(['Phone field cannot be empty'])
        )
      }
    })

    it('should throw validation error if phone is not a string', async () => {
      const invalidDto = {
        name: 'Ivan',
        password: '1234567890',
        phone: 123 as any,
        email: 'email@email.com'
      }

      try {
        const validatedDto = await pipe.transform(invalidDto, {
          type: 'body',
          metatype: CreateUserDto
        })

        await userController.create(validatedDto)
        fail('Validation should have thrown an error')
      } catch (err) {
        const response = err.getResponse ? err.getResponse() : err
        const message =
          typeof response === 'object' ? response.message : response

        expect(message).toEqual(
          expect.arrayContaining(['Phone should only be a string'])
        )
      }
    })

    it('should throw validation error if email field is empty', async () => {
      const invalidDto = {
        name: 'Ivan',
        password: '1234567890',
        phone: '88005553535',
        email: ''
      }

      try {
        const validatedDto = await pipe.transform(invalidDto, {
          type: 'body',
          metatype: CreateUserDto
        })

        await userController.create(validatedDto)
        fail('Validation should have thrown an error')
      } catch (err) {
        const response = err.getResponse ? err.getResponse() : err
        const message =
          typeof response === 'object' ? response.message : response

        expect(message).toEqual(
          expect.arrayContaining(['Email field cannot be empty'])
        )
      }
    })

    it('should throw validation error if email is not a string', async () => {
      const invalidDto = {
        name: 'Ivan',
        password: '1234567890',
        phone: '88005553535',
        email: 123 as any
      }

      try {
        const validatedDto = await pipe.transform(invalidDto, {
          type: 'body',
          metatype: CreateUserDto
        })

        await userController.create(validatedDto)
        fail('Validation should have thrown an error')
      } catch (err) {
        const response = err.getResponse ? err.getResponse() : err
        const message =
          typeof response === 'object' ? response.message : response

        expect(message).toEqual(
          expect.arrayContaining(['Email should only be a string'])
        )
      }
    })
  })

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = [
        {
          id: 1,
          name: 'Ivan',
          password: '1234567890',
          phone: '88005553535',
          email: 'email@email.com',
          roleId: 1,
          cars: [
            {
              id: 1,
              brand: 'Audi',
              model: 'A4',
              productionYear: 2012,
              owner: null as any,
              dateCreate: '2025-10-09 11:42:26.105'
            }
          ],
          dateCreate: '2025-10-09 11:42:26.105'
        } as unknown as User,
        {
          id: 2,
          name: 'Alex',
          password: '0987654321',
          phone: '89005553535',
          email: 'test@email.com',
          roleId: 1,
          cars: [
            {
              id: 2,
              brand: 'BMW',
              model: 'M5',
              productionYear: 2005,
              owner: null as any,
              dateCreate: '2024-10-09 11:42:26.105'
            }
          ],
          dateCreate: '2024-10-09 11:42:26.105'
        } as unknown as User
      ]

      jest.spyOn(userService, 'findAll').mockResolvedValue(users)

      expect(await userController.findAll()).toBe(users)
    })

    it('should return an empty massive if there is no users in db', async () => {
      const users = []

      jest.spyOn(userService, 'findAll').mockResolvedValue(users)

      expect(await userController.findAll()).toBe(users)
    })
  })

  describe('findAllWithoutCars', () => {
    it('should return all users without their cars', async () => {
      const users = [
        {
          id: 1,
          name: 'Ivan',
          password: '1234567890',
          phone: '88005553535',
          email: 'email@email.com',
          roleId: null as any,
          dateCreate: '2025-10-09 11:42:26.105'
        } as unknown as User,
        {
          id: 2,
          name: 'Alex',
          password: '0987654321',
          phone: '89005553535',
          email: 'test@email.com',
          roleId: null as any,
          dateCreate: '2024-10-09 11:42:26.105'
        } as unknown as User
      ]

      jest.spyOn(userService, 'findAllWithoutCars').mockResolvedValue(users)

      expect(await userController.findAllWithoutCars()).toBe(users)
    })

    it('should return an empty massive if there is no users in db', async () => {
      const users = []

      jest.spyOn(userService, 'findAllWithoutCars').mockResolvedValue(users)

      expect(await userController.findAllWithoutCars()).toBe(users)
    })
  })

  describe('findOne', () => {
    it('findOne', async () => {
      const user = {
        id: 1,
        name: 'Ivan',
        password: '1234567890',
        phone: '88005553535',
        email: 'email@email.com',
        roleId: 1,
        cars: [
          {
            id: 1,
            brand: 'Audi',
            model: 'A4',
            productionYear: 2012,
            owner: null as any,
            dateCreate: '2025-10-09 11:42:26.105'
          }
        ],
        dateCreate: '2025-10-09 11:42:26.105'
      } as unknown as User

      const id = '1'

      jest.spyOn(userService, 'findOneById').mockResolvedValue(user)

      expect(await userController.findOne(id)).toBe(user)
    })

    it('should return null if user doesnt exists', async () => {
      const userId = '1'

      jest.spyOn(userService, 'findOneById').mockResolvedValue(null)

      expect(await userController.findOne(userId)).toBe(null)
    })
  })

  describe('findCarsByEmail', () => {
    it('should return users with cars by email', async () => {
      const cars = [
        {
          id: 1,
          name: 'Ivan',
          password: '1234567890',
          phone: '88005553535',
          email: 'email@email.com',
          roleId: 1,
          cars: [
            {
              id: 1,
              brand: 'Audi',
              model: 'A4',
              productionYear: 2012,
              owner: null as any,
              dateCreate: '2025-10-09 11:42:26.105'
            }
          ],
          dateCreate: '2025-10-09 11:42:26.105'
        } as unknown as User
      ]

      jest.spyOn(userService, 'findCarsByEmail').mockResolvedValue(cars)

      expect(await userController.findCarsByEmail('email@email.com')).toBe(cars)
    })

    it('should return an empty massive if user doesnt exists', async () => {
      const user = []

      jest.spyOn(userService, 'findCarsByEmail').mockResolvedValue(user)

      expect(await userController.findCarsByEmail('email@email.com')).toBe(user)
    })
  })

  describe('update', () => {
    it('should update user', async () => {
      const updateUserDto = {
        name: 'Antonio',
        password: '123qwe123',
        phone: '89215553535',
        email: 'goodmail@mail.com'
      }

      const user = {
        id: 1,
        ...updateUserDto,
        roleId: 1,
        cars: [],
        dateCreate: '2025-10-09 11:42:26.105'
      }

      const updateResult: UpdateResult = {
        generatedMaps: [],
        raw: user,
        affected: 1
      }

      jest.spyOn(userService, 'update').mockResolvedValue(updateResult)

      expect(await userController.update('1', updateUserDto)).toBe(updateResult)
    })
  })

  describe('remove', () => {
    it('should delete user', async () => {
      const user = {
        id: 1,
        name: 'Antonio',
        password: '123qwe123',
        phone: '89215553535',
        email: 'goodmail@mail.com',
        roleId: 1,
        cars: [],
        dateCreate: '2025-10-09 11:42:26.105'
      }

      const deleteResult: DeleteResult = {
        raw: user,
        affected: 1
      }

      jest.spyOn(userService, 'remove').mockResolvedValue(deleteResult)

      expect(await userController.remove('1')).toBe(deleteResult)
    })
  })
})
