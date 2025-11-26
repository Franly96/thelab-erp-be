import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('payment_methods')
export class PaymentMethodEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id!: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  name!: string;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt!: Date;
}
