import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryEntity } from '../database/entities/inventory.entity';
import { InvoiceEntity } from '../database/entities/invoice.entity';
import { LocationEntity } from '../database/entities/location.entity';
import { OrderItemEntity } from '../database/entities/order-item.entity';
import { OrderEntity } from '../database/entities/order.entity';
import { UserEntity } from '../database/entities/user.entity';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderEntity,
      OrderItemEntity,
      InvoiceEntity,
      InventoryEntity,
      UserEntity,
      LocationEntity,
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class SalesModule {}
