import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Case } from './case.entity'
import { Skin } from '../../skins/entities/skin.entity'

@Entity('case_items')
export class CaseItem {
  @PrimaryGeneratedColumn('uuid')
  id: string

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

  @Column({ name: 'drop_weight', type: 'decimal', precision: 10, scale: 4 })
  dropWeight: number
}

