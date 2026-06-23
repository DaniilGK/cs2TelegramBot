import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

export enum RaffleType {
  DAILY = 'daily',
  WEEKLY = 'weekly',
}

@Entity('raffles')
export class Raffle {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'enum', enum: RaffleType })
  type: RaffleType

  @Column({ name: 'prize_description', type: 'varchar' })
  prizeDescription: string

  @Column({ name: 'ticket_cost', type: 'int' })
  ticketCost: number

  @Column({ name: 'ends_at', type: 'timestamptz' })
  endsAt: Date

  @Column({ name: 'winners_count', type: 'int' })
  winnersCount: number

  @Column({ name: 'is_active', type: 'boolean' })
  isActive: boolean
}

