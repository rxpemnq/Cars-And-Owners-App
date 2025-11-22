import { Test, TestingModule } from '@nestjs/testing'
import { CarController } from './car.controller'
import { CarService } from './car.service'
import { APP_PIPE } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { Car } from 'src/cars/entities/car.entity'
import { DeleteResult, UpdateResult } from 'typeorm'
import { CreateCarDto } from './dto'

describe('car controller', () => {
  let carController: CarController
  let carService: CarService

  const pipe = new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true
  })

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [CarController],
      providers: [
        {
          provide: CarService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findCarsByBrand: jest.fn(),
            findAllByUserId: jest.fn(),
            findAllWithoutOwners: jest.fn(),
            findAllByBrand: jest.fn(),
            findOne: jest.fn(),
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

    carController = moduleRef.get<CarController>(CarController)
    carService = moduleRef.get<CarService>(CarService)
  })

  describe('create', () => {
    it('should create car', async () => {
      const createCarDto = {
        brand: 'BMW',
        model: 'M5',
        productionYear: 2005
      }

      const car = {
        id: 1,
        brand: 'BMW',
        model: 'M5',
        productionYear: 2005,
        owner: null as any,
        dateCreate: '2025-10-09 11:42:26.105'
      } as unknown as Car

      jest.spyOn(carService, 'create').mockResolvedValue(car)

      expect(
        await carController.create({ user: { id: 1 } }, createCarDto)
      ).toBe(car)
    })

    it('should throw validation error if brand is empty', async () => {
      const invalidDto = {
        brand: '',
        model: 'M5',
        productionYear: 2005
      }

      try {
        const validatedDto = await pipe.transform(invalidDto, {
          type: 'body',
          metatype: CreateCarDto
        })

        await carController.create(1, validatedDto)
        fail('Validation should have thrown an error')
      } catch (err) {
        const response = err.getResponse ? err.getResponse() : err
        const message =
          typeof response === 'object' ? response.message : response

        expect(message).toEqual(
          expect.arrayContaining(['Brand field cannot be empty'])
        )
      }
    })

    it('should throw validation error if brand is not a string', async () => {
      const invalidDto = {
        brand: 123 as any,
        model: 'M5',
        productionYear: 2005
      }

      try {
        const validatedDto = await pipe.transform(invalidDto, {
          type: 'body',
          metatype: CreateCarDto
        })

        await carController.create(1, validatedDto)
        fail('Validation should have thrown an error')
      } catch (err) {
        const response = err.getResponse ? err.getResponse() : err
        const message =
          typeof response === 'object' ? response.message : response

        expect(message).toEqual(
          expect.arrayContaining(['Brand should only be a string'])
        )
      }
    })

    it('should throw validation error if model is empty', async () => {
      const invalidDto = {
        brand: 'BMW',
        model: '',
        productionYear: 2005
      }

      try {
        const validatedDto = await pipe.transform(invalidDto, {
          type: 'body',
          metatype: CreateCarDto
        })

        await carController.create(1, validatedDto)
        fail('Validation should have thrown an error')
      } catch (err) {
        const response = err.getResponse ? err.getResponse() : err
        const message =
          typeof response === 'object' ? response.message : response

        expect(message).toEqual(
          expect.arrayContaining(['Model field cannot be empty'])
        )
      }
    })

    it('should throw validation error if model is not a string', async () => {
      const invalidDto = {
        brand: 'BMW',
        model: 123 as any,
        productionYear: 2005
      }

      try {
        const validatedDto = await pipe.transform(invalidDto, {
          type: 'body',
          metatype: CreateCarDto
        })

        await carController.create(1, validatedDto)
        fail('Validation should have thrown an error')
      } catch (err) {
        const response = err.getResponse ? err.getResponse() : err
        const message =
          typeof response === 'object' ? response.message : response

        expect(message).toContain('Model should only be a string')
      }
    })

    it('should throw validation error if productionYear is not an int', async () => {
      const invalidDto = {
        brand: 'BMW',
        model: 'M5',
        productionYear: '2005' as any
      }

      try {
        const validatedDto = await pipe.transform(invalidDto, {
          type: 'body',
          metatype: CreateCarDto
        })

        await carController.create(1, validatedDto)
        fail('Validation should have thrown an error')
      } catch (err) {
        const response = err.getResponse ? err.getResponse() : err
        const message =
          typeof response === 'object' ? response.message : response

        expect(message).toContain(
          'Year of production should only be an integer'
        )
      }
    })
  })

  describe('findAll', () => {
    it('should return all cars', async () => {
      const cars = [
        {
          id: 1,
          brand: 'BMW',
          model: 'M5',
          productionYear: 2005,
          owner: null as any,
          dateCreate: '2025-10-09 11:42:26.105'
        } as unknown as Car,
        {
          id: 2,
          brand: 'Audi',
          model: 'A4',
          productionYear: 2012,
          owner: null as any,
          dateCreate: '2024-10-09 11:42:26.105'
        } as unknown as Car
      ]

      jest.spyOn(carService, 'findAll').mockResolvedValue(cars)

      expect(await carController.findAll()).toBe(cars)
    })

    it('should return an empty massive if there is no cars in db', async () => {
      const cars = []

      jest.spyOn(carService, 'findAll').mockResolvedValue(cars)

      expect(await carController.findAll()).toBe(cars)
    })
  })

  describe('findAllByUserId', () => {
    it('should return all cars by userId', async () => {
      const cars = [
        {
          id: 1,
          brand: 'BMW',
          model: 'M5',
          productionYear: 2005,
          owner: null as any,
          dateCreate: '2025-10-09 11:42:26.105'
        } as unknown as Car,
        {
          id: 2,
          brand: 'Audi',
          model: 'A4',
          productionYear: 2012,
          owner: null as any,
          dateCreate: '2024-10-09 11:42:26.105'
        } as unknown as Car
      ]

      jest.spyOn(carService, 'findAllByUserId').mockResolvedValue(cars)

      expect(await carController.findAllByUserId({ user: { id: 1 } })).toBe(
        cars
      )
    })

    it('should return an empty massive if there is no user id db', async () => {
      const cars = []

      jest.spyOn(carService, 'findAllByUserId').mockResolvedValue(cars)

      expect(await carController.findAllByUserId({ user: { id: 1 } })).toBe(
        cars
      )
    })
  })

  describe('findAllWithoutOwners', () => {
    it('should return all cars without owners', async () => {
      const cars = [
        {
          id: 1,
          brand: 'BMW',
          model: 'M5',
          productionYear: 2005,
          dateCreate: '2025-10-09 11:42:26.105'
        } as unknown as Car,
        {
          id: 2,
          brand: 'Audi',
          model: 'A4',
          productionYear: 2012,
          dateCreate: '2024-10-09 11:42:26.105'
        } as unknown as Car
      ]

      jest.spyOn(carService, 'findAllWithoutOwners').mockResolvedValue(cars)

      expect(await carController.findAllWithoutOwners()).toBe(cars)
    })

    it('should return an empty massive if there is no cars in db', async () => {
      const cars = []

      jest.spyOn(carService, 'findAllWithoutOwners').mockResolvedValue(cars)

      expect(await carController.findAllWithoutOwners()).toBe(cars)
    })
  })

  describe('findAllByBrand', () => {
    it('should return all cars by brand', async () => {
      const cars = [
        {
          id: 1,
          brand: 'BMW',
          model: 'M5',
          productionYear: 2005,
          dateCreate: '2025-10-09 11:42:26.105'
        } as unknown as Car,
        {
          id: 2,
          brand: 'BMW',
          model: '3',
          productionYear: 2012,
          dateCreate: '2024-10-09 11:42:26.105'
        } as unknown as Car
      ]

      jest.spyOn(carService, 'findCarsByBrand').mockResolvedValue(cars)

      expect(await carController.findAllByBrand('BMW')).toBe(cars)
    })

    it('should return an empty massive if there is no cars with that brand in db', async () => {
      const cars = []

      jest.spyOn(carService, 'findCarsByBrand').mockResolvedValue(cars)

      expect(await carController.findAllByBrand('BMW')).toBe(cars)
    })
  })

  describe('findOne', () => {
    it('should return car by id', async () => {
      const car = {
        id: 1,
        brand: 'BMW',
        model: '3',
        productionYear: 2012,
        dateCreate: '2024-10-09 11:42:26.105'
      } as unknown as Car

      jest.spyOn(carService, 'findOne').mockResolvedValue(car)

      expect(await carController.findOne('1')).toBe(car)
    })

    it('should return an empty massive if there is no cars with that id in db', async () => {
      const car = [] as unknown as Car

      jest.spyOn(carService, 'findOne').mockResolvedValue(car)

      expect(await carController.findOne('1')).toBe(car)
    })
  })

  describe('update', () => {
    it('should update car', async () => {
      const updateCarDto = {
        brand: 'Audi',
        model: 'A4',
        productionYear: 2012
      }

      const car = {
        id: 1,
        ...updateCarDto,
        owner: [],
        dateCreate: '2025-10-09 11:42:26.105'
      }

      const updateResult: UpdateResult = {
        generatedMaps: [],
        raw: car,
        affected: 1
      }

      jest.spyOn(carService, 'update').mockResolvedValue(updateResult)

      expect(await carController.update('1', updateCarDto)).toBe(updateResult)
    })
  })

  describe('remove', () => {
    it('should delete car', async () => {
      const car = {
        id: 1,
        brand: 'Audi',
        model: 'A4',
        productionYear: 2012,
        owner: [],
        dateCreate: '2025-10-09 11:42:26.105'
      }

      const deleteResult: DeleteResult = {
        raw: car,
        affected: 1
      }

      jest.spyOn(carService, 'remove').mockResolvedValue(deleteResult)

      expect(await carController.remove('1')).toBe(deleteResult)
    })
  })
})
