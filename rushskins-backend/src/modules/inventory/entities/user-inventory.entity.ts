import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from '../../users/entities/user.entity'
import { Skin } from '../../skins/entities/skin.entity'

export enum InventoryStatus {
  HELD = 'held',
  SOLD = 'sold',
  TRADED = 'traded',
}

@Entity('user_inventory')
export class UserInventory {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User

  @Column({ name: 'skin_id', type: 'uuid' })
  skinId: string

  @ManyToOne(() => Skin)
  @JoinColumn({ name: 'skin_id' })
  skin: Skin

  @Column({ type: 'enum', enum: InventoryStatus, default: InventoryStatus.HELD })
  status: InventoryStatus

  @Column({ name: 'sold_for_rc', type: 'int', nullable: true })
  soldForRc: number | null

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date
}

