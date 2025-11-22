import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn
} from 'typeorm'

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

  @CreateDateColumn({ type: 'timestamp' })
  dateCreate: Date
}
