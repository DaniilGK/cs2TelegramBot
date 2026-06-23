import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from '../../users/entities/user.entity'

export enum TransactionType {
  DEPOSIT = 'deposit',
  SPEND = 'spend',
  SELL = 'sell',
  TICKETS_EARN = 'tickets_earn',
  TICKETS_SPEND = 'tickets_spend',
}

export enum TransactionCurrency {
  RC = 'rc',
  TICKETS = 'tickets',
}

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User

  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType

  @Column({ type: 'int' })
  amount: number

  @Column({ type: 'enum', enum: TransactionCurrency })
  currency: TransactionCurrency

  @Column({ type: 'varchar', nullable: true })
  description: string | null

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date
}

