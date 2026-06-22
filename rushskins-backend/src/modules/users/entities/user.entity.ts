import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, OneToMany, Index,
} from 'typeorm'

export enum UserRole { USER = 'user', ADMIN = 'admin', BANNED = 'banned' }

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Index({ unique: true })
  @Column({ name: 'telegram_id', type: 'bigint' })
  telegramId: string

  @Column({ nullable: true })
  username?: string

  @Column({ name: 'first_name', nullable: true })
  firstName?: string

  @Column({ name: 'last_name', nullable: true })
  lastName?: string

  @Column({ name: 'avatar_url', nullable: true })
  avatarUrl?: string

  // Steam
  @Index({ unique: true, sparse: true })
  @Column({ name: 'steam_id', nullable: true })
  steamId?: string

  @Column({ name: 'steam_username', nullable: true })
  steamUsername?: string

  @Column({ name: 'trade_url', nullable: true })
  tradeUrl?: string

  // Economy
  @Column({ name: 'balance_cents', type: 'bigint', default: 0 })
  balanceCents: number          // real money in cents

  @Column({ type: 'bigint', default: 0 })
  coins: number                 // click-to-earn currency

  @Column({ type: 'int', default: 500 })
  energy: number

  @Column({ name: 'max_energy', type: 'int', default: 500 })
  maxEnergy: number

  @Column({ type: 'int', default: 1 })
  level: number

  @Column({ type: 'int', default: 0 })
  xp: number

  // Referral
  @Column({ name: 'referral_code', unique: true, nullable: true })
  referralCode?: string

  @Column({ name: 'referred_by', nullable: true })
  referredBy?: string           // userId of referrer

  // Daily check-in
  @Column({ name: 'last_checkin_at', type: 'timestamptz', nullable: true })
  lastCheckinAt?: Date

  @Column({ name: 'checkin_streak', type: 'int', default: 0 })
  checkinStreak: number

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole

  @Column({ name: 'last_energy_refill', type: 'timestamptz', nullable: true })
  lastEnergyRefill?: Date

  // NOTE: relations removed for now (backend skeleton).

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
