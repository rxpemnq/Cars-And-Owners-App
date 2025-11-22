import { JwtPayload } from 'jwt-decode'

export interface IUser {
  id: number
  roleId: number
  name: string
  email: string
  phone: string
  dateCreate: Date
}

export interface CustomJwtPayload extends JwtPayload {
  id: number
}
