import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderEntity } from './order.entity';

@Entity('invoices')
export class InvoiceEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id!: number;

  @OneToOne(() => OrderEntity, (order) => order.invoice, { nullable: false })
  @JoinColumn({ name: 'order_id' })
  order!: OrderEntity;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'subtotal' })
  subtotal!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'tax' })
  tax!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'total' })
  total!: string;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt!: Date;
}
