import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCategoryToInventory0101738880000000
  implements MigrationInterface
{
  name = 'AddCategoryToInventory0101738880000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE inventory
      ADD COLUMN category_id BIGINT UNSIGNED NULL,
      ADD CONSTRAINT fk_inventory_category FOREIGN KEY (category_id) REFERENCES categories(id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE inventory
      DROP FOREIGN KEY fk_inventory_category,
      DROP COLUMN category_id;
    `);
  }
}
