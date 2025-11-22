import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm'
import { User } from '../../users/entities/user.entity'

@Entity()
export class Car {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  brand: string

  @Column()
  model: string

  @Column()
  productionYear: number

  @ManyToOne(() => User, (user) => user.cars, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  owner: User

  @CreateDateColumn({ type: 'timestamp' })
  dateCreate: Date
}
