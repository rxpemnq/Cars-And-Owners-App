import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Sessions {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', length: 255 })
  sid: string

  @Column({ type: 'text' })
  session: string

  @Column({ type: 'bigint' })
  expires: number
}
