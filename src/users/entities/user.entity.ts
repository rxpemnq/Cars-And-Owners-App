import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm'
import { Car } from '../../cars/entities/car.entity'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column({ select: false })
  password: string

  @Column({ unique: true })
  phone: string

  @Column({ unique: true })
  email: string

  @Column()
  roleId: number

  @OneToMany(() => Car, (car) => car.owner)
  cars: Car[]

  @CreateDateColumn({ type: 'timestamp' })
  dateCreate: Date
}
