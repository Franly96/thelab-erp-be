import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoiceEntity } from '../core/entities/invoice.entity';
import { InventoryEntity } from '../core/entities/inventory.entity';
import { LocationEntity } from '../core/entities/location.entity';
import { OrderItemEntity } from '../core/entities/order-item.entity';
import { OrderEntity } from '../core/entities/order.entity';
import { UserEntity } from '../core/entities/user.entity';
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
