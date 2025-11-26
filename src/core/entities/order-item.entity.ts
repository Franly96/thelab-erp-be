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
import { InventoryEntity } from './inventory.entity';
import { OrderEntity } from './order.entity';

@Entity('order_items')
export class OrderItemEntity implements BaseModel {
  @PrimaryGeneratedColumn({ unsigned: true })
  id!: number;

  @ManyToOne(() => OrderEntity, (order) => order.orderItems, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'order_id' })
  order!: OrderEntity;

  @ManyToOne(() => InventoryEntity, { nullable: false })
  @JoinColumn({ name: 'inventory_id' })
  inventoryItem!: InventoryEntity;

  @Column({ name: 'item_count', type: 'int', unsigned: true, default: 1 })
  itemCount!: number;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt!: Date;
}
