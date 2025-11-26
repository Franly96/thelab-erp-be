import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserTypeColumn0021738880000000 implements MigrationInterface {
  name = 'AddUserTypeColumn0021738880000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE users
      ADD COLUMN type ENUM('sysadmin', 'admin', 'manager', 'service') NOT NULL DEFAULT 'service' AFTER full_name;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE users
      DROP COLUMN type;
    `);
  }
}
