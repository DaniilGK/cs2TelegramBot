import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Season } from './season.entity'
import { User } from '../../users/entities/user.entity'

@Entity('season_scores')
export class SeasonScore {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'season_id', type: 'uuid' })
  seasonId: string

  @ManyToOne(() => Season)
  @JoinColumn({ name: 'season_id' })
  season: Season

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User

  @Column({ name: 'total_drop_value', type: 'int', default: 0 })
  totalDropValue: number
}

