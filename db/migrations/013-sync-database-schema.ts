import { MigrationInterface, QueryRunner } from 'typeorm';

export class SyncDatabaseSchema0131737940000000 implements MigrationInterface {
  name = 'SyncDatabaseSchema0131737940000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS users (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        password_hash VARCHAR(255) NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        user_type ENUM('sysadmin','admin','manager','service') NOT NULL DEFAULT 'service',
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS payment_methods (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS locations (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS inventory (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        sku VARCHAR(100) UNIQUE DEFAULT (UUID()),
        barcodes VARCHAR(255) NOT NULL DEFAULT 'N/A',
        quantity INT UNSIGNED NOT NULL DEFAULT 0,
        location VARCHAR(255) NOT NULL DEFAULT 'N/A',
        description VARCHAR(500) NOT NULL DEFAULT 'N/A',
        category_id BIGINT UNSIGNED NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT fk_inventory_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        assigned_user_id BIGINT UNSIGNED NULL,
        location_id BIGINT UNSIGNED NULL,
        status ENUM('active','deleted','paid') NOT NULL DEFAULT 'active',
        observation VARCHAR(500) NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT fk_orders_user FOREIGN KEY (assigned_user_id) REFERENCES users(id) ON DELETE SET NULL,
        CONSTRAINT fk_orders_location FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        order_id BIGINT UNSIGNED NOT NULL,
        inventory_id BIGINT UNSIGNED NOT NULL,
        item_count INT UNSIGNED NOT NULL DEFAULT 1,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        CONSTRAINT fk_order_items_inventory FOREIGN KEY (inventory_id) REFERENCES inventory(id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS invoices (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        order_id BIGINT UNSIGNED NOT NULL UNIQUE,
        subtotal DECIMAL(10,2) NOT NULL,
        tax DECIMAL(10,2) NOT NULL,
        total DECIMAL(10,2) NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT fk_invoices_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS invoices`);
    await queryRunner.query(`DROP TABLE IF EXISTS order_items`);
    await queryRunner.query(`DROP TABLE IF EXISTS orders`);
    await queryRunner.query(`DROP TABLE IF EXISTS inventory`);
    await queryRunner.query(`DROP TABLE IF EXISTS payment_methods`);
    await queryRunner.query(`DROP TABLE IF EXISTS locations`);
    await queryRunner.query(`DROP TABLE IF EXISTS categories`);
    await queryRunner.query(`DROP TABLE IF EXISTS users`);
  }
}
