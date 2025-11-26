import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderStatus } from '../enums/order-status.enum';
import { BaseModel } from '../models/base.model';
import { InvoiceEntity } from './invoice.entity';
import { LocationEntity } from './location.entity';
import { OrderItemEntity } from './order-item.entity';
import { UserEntity } from './user.entity';

@Entity('orders')
export class OrderEntity implements BaseModel {
  @PrimaryGeneratedColumn({ unsigned: true })
  id!: number;

  @ManyToOne(() => UserEntity, { nullable: true })
  @JoinColumn({ name: 'assigned_user_id' })
  assignedUser!: UserEntity | null;

  @ManyToOne(() => LocationEntity, { nullable: true })
  @JoinColumn({ name: 'location_id' })
  location!: LocationEntity | null;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.Active,
  })
  status!: OrderStatus;

  @Column({ type: 'varchar', length: 500, nullable: true })
  observation!: string | null;

  @OneToMany(() => OrderItemEntity, (item) => item.order, {
    cascade: true,
  })
  orderItems!: OrderItemEntity[];

  @OneToOne(() => InvoiceEntity, (invoice) => invoice.order, {
    cascade: true,
  })
  invoice!: InvoiceEntity | null;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt!: Date;
}
