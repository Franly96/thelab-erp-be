import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOrdersTable0111738880000000 implements MigrationInterface {
  name = 'CreateOrdersTable0111738880000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        assigned_user_id BIGINT UNSIGNED NULL,
        location_id BIGINT UNSIGNED NULL,
        status ENUM('active', 'deleted', 'paid') NOT NULL DEFAULT 'active',
        observation VARCHAR(500) NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT fk_orders_assigned_user FOREIGN KEY (assigned_user_id) REFERENCES users(id),
        CONSTRAINT fk_orders_location FOREIGN KEY (location_id) REFERENCES locations(id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS orders');
  }
}
