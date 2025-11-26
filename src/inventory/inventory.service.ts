import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryEntity } from '../core/entities/inventory.entity';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(InventoryEntity)
    private readonly inventoryRepo: Repository<InventoryEntity>,
  ) {}

  async findAll(): Promise<InventoryEntity[]> {
    return this.inventoryRepo.find({ order: { id: 'DESC' } });
  }

  async findOne(id: number): Promise<InventoryEntity> {
    const item = await this.inventoryRepo.findOne({ where: { id } });
    if (!item) {
      throw new NotFoundException(`Inventory item ${id} not found`);
    }
    return item;
  }

  private async findBySku(sku: string): Promise<InventoryEntity | null> {
    return this.inventoryRepo.findOne({ where: { sku } });
  }

  private generateSku(): string {
    return `SKU-${randomUUID()}`;
  }

  async create(dto: CreateInventoryDto): Promise<InventoryEntity> {
    const sku = dto.sku ?? this.generateSku();
    if (dto.sku) {
      const existing = await this.findBySku(sku);
      if (existing) {
        throw new ConflictException('SKU already in use');
      }
    }

    const item = this.inventoryRepo.create({
      name: dto.name,
      sku,
      quantity: dto.quantity ?? 0,
      location: dto.location ?? 'N/A',
      description: dto.description ?? 'N/A',
      barcodes: dto.barcodes ?? 'N/A',
    });

    return this.inventoryRepo.save(item);
  }

  async update(
    id: number,
    dto: UpdateInventoryDto,
  ): Promise<InventoryEntity> {
    const existing = await this.findOne(id);

    if (dto.sku && dto.sku !== existing.sku) {
      const skuOwner = await this.findBySku(dto.sku);
      if (skuOwner && skuOwner.id !== id) {
        throw new ConflictException('SKU already in use');
      }
      existing.sku = dto.sku;
    }

    if (dto.name !== undefined) {
      existing.name = dto.name;
    }
    if (dto.quantity !== undefined) {
      existing.quantity = dto.quantity;
    }
    if (dto.location !== undefined) {
      existing.location = dto.location;
    }
    if (dto.description !== undefined) {
      existing.description = dto.description;
    }
    if (dto.barcodes !== undefined) {
      existing.barcodes = dto.barcodes;
    }

    return this.inventoryRepo.save(existing);
  }

  async remove(id: number): Promise<void> {
    const existing = await this.findOne(id);
    await this.inventoryRepo.remove(existing);
  }
}
