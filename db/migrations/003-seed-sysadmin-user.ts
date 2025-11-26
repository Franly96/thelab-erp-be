/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { createHash } from 'crypto';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedSysAdminUser0031738880000000 implements MigrationInterface {
  name = 'SeedSysAdminUser0031738880000000';

  private hashPassword(password: string, salt: string): string {
    return createHash('sha256').update(`${password}:${salt}`).digest('hex');
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    const fullName = 'SYS Admin';
    const password = 'SYSADMIN2025';
    const userType = 'sysadmin';
    const salt = process.env.PASSWORD_SALT ?? 'thelab-salt';
    const passwordHash = this.hashPassword(password, salt);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const [existing] = await queryRunner.query(
      'SELECT id FROM users WHERE full_name = ? LIMIT 1',
      [fullName],
    );

    if (existing?.id) {
      await queryRunner.query(
        `
        UPDATE users
        SET password_hash = ?, type = ?, updated_at = NOW()
        WHERE id = ?
      `,
        [passwordHash, userType, existing.id],
      );
      return;
    }

    await queryRunner.query(
      `
      INSERT INTO users (email, password_hash, full_name, type, created_at, updated_at)
      VALUES (?, ?, ?, ?, NOW(), NOW())
    `,
      [null, passwordHash, fullName, userType],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DELETE FROM users WHERE full_name = ?', [
      'SYS Admin',
    ]);
  }
}
