import { OrderStatus } from '../../database/enums/order-status.enum';
import { OrderItemDto } from './order-item.dto';

export class UpdateOrderDto {
  assignedUserId?: number | null;
  locationId?: number | null;
  status?: OrderStatus;
  observation?: string | null;
  items?: OrderItemDto[];
  invoice?: {
    subtotal: number;
    tax: number;
    total: number;
  } | null;
}
