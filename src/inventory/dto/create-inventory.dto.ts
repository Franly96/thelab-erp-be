export class CreateInventoryDto {
  name!: string;
  sku?: string;
  quantity?: number;
  location?: string | null;
  description?: string | null;
  barcodes?: string;
}
