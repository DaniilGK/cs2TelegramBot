import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from '../../users/entities/user.entity'
import { Case } from './case.entity'
import { Skin } from '../../skins/entities/skin.entity'

@Entity('case_opens')
export class CaseOpen {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User

  @Column({ name: 'case_id', type: 'uuid' })
  caseId: string

  @ManyToOne(() => Case)
  @JoinColumn({ name: 'case_id' })
  case: Case

  @Column({ name: 'skin_id', type: 'uuid' })
  skinId: string

  @ManyToOne(() => Skin)
  @JoinColumn({ name: 'skin_id' })
  skin: Skin

  @Column({ name: 'tickets_earned', type: 'int' })
  ticketsEarned: number

  @CreateDateColumn({ name: 'opened_at', type: 'timestamptz' })
  openedAt: Date
}

