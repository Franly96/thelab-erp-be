import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BaseModel } from '../models/base.model';
import { CategoryEntity } from './category.entity';

@Entity('inventory')
export class InventoryEntity implements BaseModel {
  @PrimaryGeneratedColumn({ unsigned: true })
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({
    type: 'varchar',
    length: 100,
    unique: true,
    default: () => 'UUID()',
  })
  sku!: string;

  @Column({ type: 'varchar', length: 255, default: 'N/A' })
  barcodes!: string;

  @Column({ type: 'int', unsigned: true, default: 0 })
  quantity!: number;

  @Column({ type: 'varchar', length: 255, default: 'N/A' })
  location!: string;

  @Column({ type: 'varchar', length: 500, default: 'N/A' })
  description!: string;

  @ManyToOne(() => CategoryEntity, { nullable: true })
  @JoinColumn({ name: 'category_id' })
  category!: CategoryEntity | null;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt!: Date;
}
