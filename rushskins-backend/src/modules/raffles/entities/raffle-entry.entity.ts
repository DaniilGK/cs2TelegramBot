import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Raffle } from './raffle.entity'
import { User } from '../../users/entities/user.entity'

@Entity('raffle_entries')
export class RaffleEntry {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'raffle_id', type: 'uuid' })
  raffleId: string

  @ManyToOne(() => Raffle)
  @JoinColumn({ name: 'raffle_id' })
  raffle: Raffle

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User

  @Column({ name: 'tickets_spent', type: 'int' })
  ticketsSpent: number

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date
}

