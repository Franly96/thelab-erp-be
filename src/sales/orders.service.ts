import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { InventoryEntity } from '../core/entities/inventory.entity';
import { InvoiceEntity } from '../core/entities/invoice.entity';
import { LocationEntity } from '../core/entities/location.entity';
import { OrderItemEntity } from '../core/entities/order-item.entity';
import { OrderEntity } from '../core/entities/order.entity';
import { UserEntity } from '../core/entities/user.entity';
import { OrderStatus } from '../core/enums/order-status.enum';
import { UserType } from '../core/enums/user-type.enum';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly ordersRepo: Repository<OrderEntity>,
    @InjectRepository(OrderItemEntity)
    private readonly orderItemsRepo: Repository<OrderItemEntity>,
    @InjectRepository(InventoryEntity)
    private readonly inventoryRepo: Repository<InventoryEntity>,
    @InjectRepository(UserEntity)
    private readonly usersRepo: Repository<UserEntity>,
    @InjectRepository(LocationEntity)
    private readonly locationsRepo: Repository<LocationEntity>,
    @InjectRepository(InvoiceEntity)
    private readonly invoicesRepo: Repository<InvoiceEntity>,
  ) {}

  async findAll(): Promise<OrderEntity[]> {
    return this.ordersRepo.find({
      order: { id: 'DESC' },
      relations: [
        'assignedUser',
        'location',
        'orderItems',
        'orderItems.inventoryItem',
        'invoice',
      ],
    });
  }

  async findOne(id: number): Promise<OrderEntity> {
    const order = await this.ordersRepo.findOne({
      where: { id },
      relations: [
        'assignedUser',
        'location',
        'orderItems',
        'orderItems.inventoryItem',
        'invoice',
      ],
    });
    if (!order) {
      throw new NotFoundException(`Order ${id} not found`);
    }
    return order;
  }

  private formatAmount(amount: number): string {
    return amount.toFixed(2);
  }

  private async resolveAssignedUser(
    userId?: number | null,
  ): Promise<UserEntity | null> {
    if (userId === undefined || userId === null) {
      return null;
    }
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User ${userId} not found`);
    }
    if (user.type !== UserType.Manager && user.type !== UserType.Service) {
      throw new BadRequestException(
        'Assigned user must be of type manager or service',
      );
    }
    return user;
  }

  private async resolveLocation(
    locationId?: number | null,
  ): Promise<LocationEntity | null> {
    if (locationId === undefined || locationId === null) {
      return null;
    }
    const location = await this.locationsRepo.findOne({
      where: { id: locationId },
    });
    if (!location) {
      throw new NotFoundException(`Location ${locationId} not found`);
    }
    return location;
  }

  private ensureItems(items: CreateOrderDto['items']): void {
    if (!items || items.length === 0) {
      throw new BadRequestException('At least one item is required');
    }
    for (const item of items) {
      if (!item.inventoryId || item.itemCount <= 0) {
        throw new BadRequestException(
          'Each item requires inventoryId and itemCount > 0',
        );
      }
    }
  }

  private summarizeItems(
    items: { inventoryId: number; itemCount: number }[],
  ): Map<number, number> {
    const summary = new Map<number, number>();
    for (const item of items) {
      const current = summary.get(item.inventoryId) ?? 0;
      summary.set(item.inventoryId, current + item.itemCount);
    }
    return summary;
  }

  private async loadInventories(
    inventoryIds: number[],
  ): Promise<Map<number, InventoryEntity>> {
    const uniques = Array.from(new Set(inventoryIds));
    if (!uniques.length) return new Map();
    const records = await this.inventoryRepo.find({
      where: { id: In(uniques) },
    });
    const map = new Map<number, InventoryEntity>();
    for (const inv of records) {
      map.set(inv.id, inv);
    }
    return map;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  private async checkAndAdjustStock(
    inventoryMap: Map<number, InventoryEntity>,
    deltas: Map<number, number>,
  ) {
    for (const [id, delta] of deltas) {
      const inv = inventoryMap.get(id);
      if (!inv) {
        throw new NotFoundException(`Inventory item ${id} not found`);
      }
      if (delta > 0 && inv.quantity < delta) {
        throw new BadRequestException(
          `Insufficient quantity for inventory item ${id}`,
        );
      }
    }

    for (const [id, delta] of deltas) {
      const inv = inventoryMap.get(id)!;
      inv.quantity -= delta;
    }
  }

  private buildOrderItems(
    order: OrderEntity,
    inventoryMap: Map<number, InventoryEntity>,
    summary: Map<number, number>,
  ): OrderItemEntity[] {
    const items: OrderItemEntity[] = [];
    for (const [inventoryId, count] of summary.entries()) {
      const inv = inventoryMap.get(inventoryId);
      if (!inv) {
        throw new NotFoundException(`Inventory item ${inventoryId} not found`);
      }
      const orderItem = this.orderItemsRepo.create({
        order,
        inventoryItem: inv,
        itemCount: count,
      });
      items.push(orderItem);
    }
    return items;
  }

  private buildInvoice(
    order: OrderEntity,
    invoice:
      | {
          subtotal: number;
          tax: number;
          total: number;
        }
      | undefined
      | null,
  ): InvoiceEntity | null {
    if (!invoice) {
      return null;
    }
    return this.invoicesRepo.create({
      order,
      subtotal: this.formatAmount(invoice.subtotal),
      tax: this.formatAmount(invoice.tax),
      total: this.formatAmount(invoice.total),
    });
  }

  async create(dto: CreateOrderDto): Promise<OrderEntity> {
    this.ensureItems(dto.items);

    const assignedUser = await this.resolveAssignedUser(dto.assignedUserId);
    const location = await this.resolveLocation(dto.locationId);
    const status = dto.status ?? OrderStatus.Active;
    const observation = dto.observation ?? null;

    const summary = this.summarizeItems(dto.items);
    const inventoryIds = Array.from(summary.keys());
    const inventoryMap = await this.loadInventories(inventoryIds);

    await this.checkAndAdjustStock(inventoryMap, summary);

    const order = this.ordersRepo.create({
      assignedUser,
      location,
      status,
      observation,
    });

    const invoice = this.buildInvoice(order, dto.invoice);
    if (invoice) {
      order.invoice = invoice;
    }

    order.orderItems = this.buildOrderItems(order, inventoryMap, summary);

    await this.inventoryRepo.save(Array.from(inventoryMap.values()));
    return this.ordersRepo.save(order);
  }

  async update(id: number, dto: UpdateOrderDto): Promise<OrderEntity> {
    const existing = await this.findOne(id);

    const assignedUser =
      dto.assignedUserId !== undefined
        ? await this.resolveAssignedUser(dto.assignedUserId)
        : existing.assignedUser;

    const location =
      dto.locationId !== undefined
        ? await this.resolveLocation(dto.locationId)
        : existing.location;

    const status = dto.status ?? existing.status;
    const observation =
      dto.observation !== undefined ? dto.observation : existing.observation;

    if (dto.items) {
      this.ensureItems(dto.items);

      const existingSummary = this.summarizeItems(
        existing.orderItems.map((i) => ({
          inventoryId: i.inventoryItem.id,
          itemCount: i.itemCount,
        })),
      );
      const newSummary = this.summarizeItems(dto.items);

      const inventoryIds = Array.from(
        new Set([...existingSummary.keys(), ...newSummary.keys()]),
      );
      const inventoryMap = await this.loadInventories(inventoryIds);

      const deltas = new Map<number, number>();
      for (const id of inventoryIds) {
        const prev = existingSummary.get(id) ?? 0;
        const next = newSummary.get(id) ?? 0;
        const delta = next - prev; // positive means consume more
        if (delta !== 0) {
          deltas.set(id, delta);
        }
      }

      await this.checkAndAdjustStock(inventoryMap, deltas);

      await this.orderItemsRepo.remove(existing.orderItems);
      existing.orderItems = this.buildOrderItems(
        existing,
        inventoryMap,
        newSummary,
      );
      await this.inventoryRepo.save(Array.from(inventoryMap.values()));
    }

    existing.assignedUser = assignedUser;
    existing.location = location;
    existing.status = status;
    existing.observation = observation;

    if (dto.invoice !== undefined) {
      if (dto.invoice === null) {
        existing.invoice = null;
      } else if (existing.invoice) {
        existing.invoice.subtotal = this.formatAmount(dto.invoice.subtotal);
        existing.invoice.tax = this.formatAmount(dto.invoice.tax);
        existing.invoice.total = this.formatAmount(dto.invoice.total);
      } else {
        existing.invoice = this.buildInvoice(existing, dto.invoice);
      }
    }

    return this.ordersRepo.save(existing);
  }

  async remove(id: number): Promise<void> {
    const existing = await this.findOne(id);

    const inventoryAdjustments = this.summarizeItems(
      existing.orderItems.map((i) => ({
        inventoryId: i.inventoryItem.id,
        itemCount: i.itemCount,
      })),
    );

    const inventoryMap = await this.loadInventories(
      Array.from(inventoryAdjustments.keys()),
    );
    for (const [id, count] of inventoryAdjustments) {
      const inv = inventoryMap.get(id);
      if (inv) {
        inv.quantity += count;
      }
    }
    await this.inventoryRepo.save(Array.from(inventoryMap.values()));

    await this.ordersRepo.remove(existing);
  }
}
