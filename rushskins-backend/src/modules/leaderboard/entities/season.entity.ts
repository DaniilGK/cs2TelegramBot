import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('seasons')
export class Season {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'start_at', type: 'timestamptz' })
  startAt: Date

  @Column({ name: 'end_at', type: 'timestamptz' })
  endAt: Date

  @Column({ name: 'is_active', type: 'boolean', default: false })
  isActive: boolean
}

