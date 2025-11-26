import { OrderStatus } from 'src/database/enums/order-status.enum';
import { OrderItemDto } from './order-item.dto';

export class CreateOrderDto {
  assignedUserId?: number;
  locationId?: number;
  status?: OrderStatus;
  observation?: string | null;
  items!: OrderItemDto[];
  invoice?: {
    subtotal: number;
    tax: number;
    total: number;
  };
}
