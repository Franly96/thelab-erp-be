import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('locations')
export class LocationEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id!: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  name!: string;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt!: Date;
}
