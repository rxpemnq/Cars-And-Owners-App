export class ResponseCarDto {
  id: number
  brand: string
  model: string
  productionYear: number
}

export class ResponseUserDto {
  userId: number
  userEmail: string
  userName: string
  sid: string
  cars?: ResponseCarDto[]
}

export class AuthResultDto {
  user?: {
    id: number
    email: string
    name: string
  }
  id?: number
  email?: string
  name?: string
  cars?: {
    id: number
    brand: string
    model: string
    productionYear: number
  }[]
}
