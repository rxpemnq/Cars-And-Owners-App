import { Test } from '@nestjs/testing'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import request from 'supertest'
import { App } from 'supertest/types'
import { AppModule } from 'src/app.module'
import session from 'express-session'
import { createSessionConfig } from 'src/libs/cookie/sessiondb.config'
import { CustomSessionStore } from 'src/libs/cookie/session-store'
import cookieParser from 'cookie-parser'

describe('AppController (e2e)', () => {
  let app: INestApplication<App>
  let customSessionStore: any
  let agent: any

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    app = moduleRef.createNestApplication()

    customSessionStore = app.get(CustomSessionStore)
    app.use(cookieParser())
    app.use(session(createSessionConfig(customSessionStore)))
    app.useGlobalPipes(new ValidationPipe({ transform: true }))

    await app.init()

    agent = request.agent(app.getHttpServer())
  })

  afterAll(async () => {
    await app.close()
  })

  describe('Auth', () => {
    describe('signUp', () => {
      it('signUp', async () => {
        return await agent
          .post('/auth/signUp')
          .send({
            name: 'TestUser',
            password: 'justA71Password?',
            phone: '+79215502030',
            email: 'test@gmail.com'
          })
          .expect(201)
          .then((res) => {
            expect(res.body).toMatchObject({
              ok: true,
              message: 'User successfully registred',
              user: 'test@gmail.com'
            })
          })
      })

      it('should deny signUp if email already exists', async () => {
        return await agent
          .post('/auth/signUp')
          .send({
            name: 'TestUser',
            password: 'justA71Password?',
            phone: '+79215502030',
            email: 'test@gmail.com'
          })
          .expect(400)
          .then((res) => {
            expect(res.body).toMatchObject({
              ok: false,
              message: 'User with this phone or email already exists'
            })
          })
      })
    })

    describe('signIn', () => {
      it('signIn', async () => {
        return await agent
          .post('/auth/signIn')
          .send({ email: 'test@gmail.com', password: 'justA71Password?' })
          .expect(201)
          .then((res) => {
            expect(res.body).toMatchObject({
              ok: true,
              user: 'test@gmail.com'
            })
          })
      })

      it('should deny signIn because of wrong params', async () => {
        return await agent
          .post('/auth/signIn')
          .send({ email: 'notExists@gmail.com', password: '1234567890' })
          .expect(401)
          .then((res) => {
            expect(res.body).toMatchObject({
              message: 'User or password arent valid'
            })
          })
      })
    })
  })

  describe('Users', () => {
    describe('create', () => {
      it('create', async () => {
        return await agent
          .post('/user')
          .send({
            name: 'AnotherTestUser',
            password: 'veryHardpass!123',
            phone: '+79992101020',
            email: 'usersTest@gmail.com'
          })
          .expect(201)
          .then((res) => {
            expect(res.body).toMatchObject({
              ok: true,
              message: 'User successfully registred',
              user: {
                dateCreate: expect.any(String),
                email: 'usersTest@gmail.com',
                id: 2,
                name: 'AnotherTestUser',
                // password: expect.any(String),
                phone: '+79992101020',
                roleId: 0
              }
            })
          })
      })

      it('should not create user (dublicate email)', async () => {
        return await agent
          .post('/user')
          .send({
            name: 'AnotherTestUser',
            password: 'veryHardpass!123',
            phone: '+79992101020',
            email: 'usersTest@gmail.com'
          })
          .expect(400)
          .then((res) => {
            expect(res.body).toMatchObject({
              ok: false,
              message: 'User with this phone or email already exists'
            })
          })
      })

      it('should not create user (dublicate phone)', async () => {
        return await agent
          .post('/user')
          .send({
            name: 'AnotherTestUser',
            password: 'veryHardpass!123',
            phone: '+79992101020',
            email: 'phoneUsersTest@gmail.com'
          })
          .expect(400)
          .then((res) => {
            expect(res.body).toMatchObject({
              ok: false,
              message: 'User with this phone or email already exists'
            })
          })
      })

      it('should not create user (empty name field)', async () => {
        await agent
          .post('/user')
          .send({
            name: '',
            password: 'veryHardpass!123',
            phone: '+79102101020',
            email: 'nameUsersTest@gmail.com'
          })
          .expect(400)
          .then((res) => {
            expect(res.body).toMatchObject({
              message: ['Name field cannot be empty'],
              error: 'Bad Request',
              statusCode: 400
            })
          })
      })

      it('should not create user (name field is not a string)', async () => {
        await agent
          .post('/user')
          .send({
            name: 123,
            password: 'veryHardpass!123',
            phone: '+79102101020',
            email: 'nameUsersTest@gmail.com'
          })
          .expect(400)
          .then((res) => {
            expect(res.body).toMatchObject({
              message: ['Name should only be a string'],
              error: 'Bad Request',
              statusCode: 400
            })
          })
      })

      it('should not create user (password is less than 8 symbols)', async () => {
        await agent
          .post('/user')
          .send({
            name: 'AnotherTestUser',
            password: 'pass1',
            phone: '+79102101020',
            email: 'nameUsersTest@gmail.com'
          })
          .expect(400)
          .then((res) => {
            expect(res.body).toMatchObject({
              message: ['Minimal lenght of password is 8 symbols'],
              error: 'Bad Request',
              statusCode: 400
            })
          })
      })

      it('should not create user (password is more than 24 symbols)', async () => {
        await agent
          .post('/user')
          .send({
            name: 'AnotherTestUser',
            password:
              'veryHardpass!123veryHardpass!123veryHardpass!123veryHardpass!123',
            phone: '+79102101020',
            email: 'nameUsersTest@gmail.com'
          })
          .expect(400)
          .then((res) => {
            expect(res.body).toMatchObject({
              message: ['Maximum lenght of password is 24 symbols'],
              error: 'Bad Request',
              statusCode: 400
            })
          })
      })

      it('should not create user (phone field is empty)', async () => {
        await agent
          .post('/user')
          .send({
            name: 'AnotherTestUser',
            password: 'veryHardpass!123',
            phone: '',
            email: 'nameUsersTest@gmail.com'
          })
          .expect(400)
          .then((res) => {
            expect(res.body).toMatchObject({
              message: [
                'Phone should only be a string',
                'Phone field cannot be empty'
              ],
              error: 'Bad Request',
              statusCode: 400
            })
          })
      })

      it('should not create user (phone field is not a string)', async () => {
        await agent
          .post('/user')
          .send({
            name: 'AnotherTestUser',
            password: 'veryHardpass!123',
            phone: 79102101020,
            email: 'nameUsersTest@gmail.com'
          })
          .expect(400)
          .then((res) => {
            expect(res.body).toMatchObject({
              message: ['Phone should only be a string'],
              error: 'Bad Request',
              statusCode: 400
            })
          })
      })

      it('should not create user (email field is empty)', async () => {
        await agent
          .post('/user')
          .send({
            name: 'AnotherTestUser',
            password: 'veryHardpass!123',
            phone: '+79102101020',
            email: ''
          })
          .expect(400)
          .then((res) => {
            expect(res.body).toMatchObject({
              message: [
                'Email should only be a string',
                'Email field cannot be empty'
              ],
              error: 'Bad Request',
              statusCode: 400
            })
          })
      })

      it('should not create user (email field is not a string)', async () => {
        await agent
          .post('/user')
          .send({
            name: 'AnotherTestUser',
            password: 'veryHardpass!123',
            phone: '+79102101020',
            email: 123123
          })
          .expect(400)
          .then((res) => {
            expect(res.body).toMatchObject({
              message: ['Email should only be a string'],
              error: 'Bad Request',
              statusCode: 400
            })
          })
      })
    })

    describe('findAll', () => {
      it('should find all users', async () => {
        return await agent
          .get('/user')
          .expect(200)
          .then((res) => {
            expect(res.body).toMatchObject([
              {
                cars: [],
                dateCreate: expect.any(String),
                email: 'usersTest@gmail.com',
                id: 2,
                name: 'AnotherTestUser',
                phone: '+79992101020',
                roleId: 0
              },
              {
                cars: [],
                dateCreate: expect.any(String),
                email: 'test@gmail.com',
                id: 1,
                name: 'TestUser',
                phone: '+79215502030',
                roleId: 0
              }
            ])
          })
      })

      describe('find all without cars', () => {
        it('find all without cars', async () => {
          return await agent
            .get('/user/without')
            .expect(200)
            .then((res) => {
              expect(res.body).toEqual(
                expect.arrayContaining([
                  {
                    dateCreate: expect.any(String),
                    email: 'usersTest@gmail.com',
                    id: 2,
                    name: 'AnotherTestUser',
                    phone: '+79992101020',
                    roleId: 0
                  },
                  {
                    dateCreate: expect.any(String),
                    email: 'test@gmail.com',
                    id: 1,
                    name: 'TestUser',
                    phone: '+79215502030',
                    roleId: 0
                  }
                ])
              )
            })
        })
      })
    })

    describe('findOne', () => {
      it('find one', async () => {
        return await agent
          .get('/user/1')
          .expect(200)
          .then((res) => {
            expect(res.body).toMatchObject({
              dateCreate: expect.any(String),
              email: 'test@gmail.com',
              id: 1,
              name: 'TestUser',
              phone: '+79215502030',
              roleId: 0
            })
          })
      })
    })

    describe('find by email', () => {
      it('find by email', async () => {
        return await agent
          .get('/user/findByEmail/test@gmail.com')
          .expect(200)
          .then((res) => {
            expect(res.body).toMatchObject([
              {
                dateCreate: expect.any(String),
                email: 'test@gmail.com',
                id: 1,
                name: 'TestUser',
                phone: '+79215502030',
                roleId: 0
              }
            ])
          })
      })
    })

    describe('update', () => {
      it('update', async () => {
        return await agent
          .patch('/user/1')
          .send({ name: 'Ivan' })
          .expect(200)
          .then((res) => {
            expect(res.body).toMatchObject({
              ok: true,
              message: 'User successfully updated',
              user: {
                dateCreate: expect.any(String),
                email: 'test@gmail.com',
                id: 1,
                name: 'Ivan',
                phone: '+79215502030',
                roleId: 0
              }
            })
          })
      })

      it('should return an exception if user is not updated', async () => {
        return await agent
          .patch('/user/9999999')
          .send({ name: 'Ivan' })
          .expect(422)
          .then((res) => {
            expect(res.body).toMatchObject({
              ok: false,
              message: 'Cannot update user',
              statusCode: 422
            })
          })
      })
    })

    describe('remove', () => {
      it('remove', async () => {
        return await agent
          .delete('/user/2')
          .expect(200)
          .then((res) => {
            expect(res.body).toMatchObject({
              ok: true,
              message: 'User successfully deleted'
            })
          })
      })

      it('should deny remove with exception', async () => {
        return await agent
          .delete('/user/57')
          .expect(422)
          .then((res) => {
            expect(res.body).toMatchObject({
              ok: false,
              message: 'Cannot delete user',
              statusCode: 422
            })
          })
      })
    })
  })

  describe('Cars', () => {
    describe('create', () => {
      it('create', async () => {
        return await agent
          .post('/car')
          .send({
            brand: 'Audi',
            model: 'A4',
            productionYear: 2012,
            owner: 1
          })
          .expect(201)
          .then((res) => {
            expect(res.body).toMatchObject({
              ok: true,
              message: 'car successfully created',
              car: {
                brand: 'Audi',
                model: 'A4',
                productionYear: 2012,
                owner: {
                  dateCreate: expect.any(String),
                  email: 'test@gmail.com',
                  id: 1,
                  name: 'Ivan',
                  phone: '+79215502030',
                  roleId: 0
                }
              }
            })
          })
      })

      it('should not create car (brand field is empty)', async () => {
        return await agent
          .post('/car')
          .send({
            brand: '',
            model: 'A4',
            productionYear: 2012,
            owner: 1
          })
          .expect(400)
          .then((res) => {
            expect(res.body).toMatchObject({
              message: ['Brand field cannot be empty']
            })
          })
      })

      it('should not create car (brand field is empty)', async () => {
        return await agent
          .post('/car')
          .send({
            brand: 123,
            model: 'A4',
            productionYear: 2012,
            owner: 1
          })
          .expect(400)
          .then((res) => {
            expect(res.body).toMatchObject({
              message: ['Brand should only be a string']
            })
          })
      })

      it('should not create car (model field is empty)', async () => {
        return await agent
          .post('/car')
          .send({
            brand: 'Audi',
            model: '',
            productionYear: 2012,
            owner: 1
          })
          .expect(400)
          .then((res) => {
            expect(res.body).toMatchObject({
              message: ['Model field cannot be empty']
            })
          })
      })

      it('should not create car (model field is not a string)', async () => {
        return await agent
          .post('/car')
          .send({
            brand: 'Audi',
            model: 123,
            productionYear: 2012,
            owner: 1
          })
          .expect(400)
          .then((res) => {
            expect(res.body).toMatchObject({
              message: ['Model should only be a string']
            })
          })
      })

      it('should not create car (production year field is empty)', async () => {
        return await agent
          .post('/car')
          .send({
            brand: 'Audi',
            model: 'A4',
            productionYear: undefined,
            owner: 1
          })
          .expect(400)
          .then((res) => {
            expect(res.body.message).toEqual(
              expect.arrayContaining([
                'Year of production field cannot be empty',
                'Year of production should only be an integer'
              ])
            )
            expect(res.body.message).toHaveLength(2)
          })
      })

      it('should not create car (production year field is not a number)', async () => {
        return await agent
          .post('/car')
          .send({
            brand: 'Audi',
            model: 'A4',
            productionYear: '2012',
            owner: 1
          })
          .expect(400)
          .then((res) => {
            expect(res.body).toMatchObject({
              message: ['Year of production should only be an integer']
            })
          })
      })
    })

    describe('find all', () => {
      it('should return all cars', async () => {
        return await agent
          .get('/car')
          .expect(200)
          .then((res) => {
            expect(res.body).toMatchObject([
              {
                id: 1,
                dateCreate: expect.any(String),
                brand: 'Audi',
                model: 'A4',
                productionYear: 2012,
                owner: {
                  dateCreate: expect.any(String),
                  email: 'test@gmail.com',
                  id: 1,
                  name: 'Ivan',
                  phone: '+79215502030',
                  roleId: 0
                }
              }
            ])
          })
      })
    })

    describe('find all by userId', () => {
      it('should find all by userId', async () => {
        return await agent
          .get('/car/myCars')
          .expect(200)
          .then((res) => {
            expect(res.body).toMatchObject([
              {
                id: 1,
                dateCreate: expect.any(String),
                brand: 'Audi',
                model: 'A4',
                productionYear: 2012,
                owner: {
                  dateCreate: expect.any(String),
                  email: 'test@gmail.com',
                  id: 1,
                  name: 'Ivan',
                  phone: '+79215502030',
                  roleId: 0
                }
              }
            ])
          })
      })
    })

    describe('findAllByBrand', () => {
      it('findAllByBrand', async () => {
        return await agent
          .get('/car/Audi')
          .expect(200)
          .then((res) => {
            expect(res.body).toMatchObject([
              {
                id: 1,
                dateCreate: expect.any(String),
                brand: 'Audi',
                model: 'A4',
                productionYear: 2012
              }
            ])
          })
      })

      it('should return exception if there is no cars with that brand in db', async () => {
        return await agent
          .get('/car/BMW')
          .expect(404)
          .then((res) => {
            expect(res.body).toMatchObject({
              ok: false,
              message: 'Cannot find cars',
              stausCode: 404
            })
          })
      })
    })

    describe('find one by id', () => {
      it('findOneById', async () => {
        return await agent
          .get('/car/getOneById/1')
          .expect(200)
          .then((res) => {
            expect(res.body).toMatchObject({
              id: 1,
              dateCreate: expect.any(String),
              brand: 'Audi',
              model: 'A4',
              productionYear: 2012,
              owner: {
                dateCreate: expect.any(String),
                email: 'test@gmail.com',
                id: 1,
                name: 'Ivan',
                phone: '+79215502030',
                roleId: 0
              }
            })
          })
      })
    })

    describe('update', () => {
      it('update', async () => {
        return await agent
          .patch('/car/1')
          .send({ brand: 'Suzuki' })
          .expect(200)
          .then((res) => {
            expect(res.body).toMatchObject({
              ok: true,
              message: 'Car successfully updated'
            })
          })
      })

      it('should return an exception if car is not found', async () => {
        return await agent
          .patch('/car/99999')
          .send({ brand: 'Cybertruck' })
          .expect(422)
          .then((res) => {
            expect(res.body).toMatchObject({
              ok: false,
              message: 'Cannot update car',
              statusCode: 422
            })
          })
      })
    })

    describe('remove', () => {
      it('remove', async () => {
        return await agent
          .delete('/car/1')
          .expect(200)
          .then((res) => {
            expect(res.body).toMatchObject({
              ok: true,
              message: 'Car successfully deleted'
            })
          })
      })

      it('should deny remove with exception', async () => {
        return await agent
          .delete('/car/123')
          .expect(422)
          .then((res) => {
            expect(res.body).toMatchObject({
              ok: false,
              message: 'Cannot delete car',
              statusCode: 422
            })
          })
      })
    })

    describe('logOut', () => {
      it('logOut', async () => {
        return await agent
          .get('/auth/logOut')
          .expect(200)
          .then((res) => {
            expect(res.body).toMatchObject({
              ok: true,
              message: 'Successfully logged out'
            })
          })
      })
    })
  })
})
