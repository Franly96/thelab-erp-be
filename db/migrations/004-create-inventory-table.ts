import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInventoryTable0041738880000000
  implements MigrationInterface
{
  name = 'CreateInventoryTable0041738880000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS inventory (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        sku VARCHAR(100) NOT NULL UNIQUE DEFAULT (UUID()),
        barcodes VARCHAR(255) NOT NULL DEFAULT 'N/A',
        quantity INT UNSIGNED NOT NULL DEFAULT 0,
        location VARCHAR(255) NOT NULL DEFAULT 'N/A',
        description VARCHAR(500) NOT NULL DEFAULT 'N/A',
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS inventory');
  }
}
