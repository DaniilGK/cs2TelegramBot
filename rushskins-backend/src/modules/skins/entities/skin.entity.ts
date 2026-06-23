import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm'

export enum SkinRarity {
  CONSUMER = 'consumer',
  INDUSTRIAL = 'industrial',
  MILSPEC = 'milspec',
  RESTRICTED = 'restricted',
  CLASSIFIED = 'classified',
  COVERT = 'covert',
  CONTRABAND = 'contraband',
}

@Entity('skins')
export class Skin {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar' })
  name: string

  @Column({ type: 'varchar' })
  weapon: string

  @Column({ type: 'varchar' })
  wear: string

  @Column({ type: 'enum', enum: SkinRarity })
  rarity: SkinRarity

  @Column({ type: 'int' })
  price: number

  @Column({ name: 'image_url', type: 'varchar' })
  imageUrl: string

  @Column({ type: 'decimal', precision: 10, scale: 6 })
  float: number

  @Column({ name: 'lis_skin_id', type: 'varchar', nullable: true })
  lisSkinId: string | null

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date
}

