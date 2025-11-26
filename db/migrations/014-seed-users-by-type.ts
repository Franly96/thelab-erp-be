import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedUsersByType0141738080000000 implements MigrationInterface {
  name = 'SeedUsersByType0141738080000000';

  private readonly users = [
    {
      fullName: 'System Admin',
      userType: 'sysadmin',
      passwordHash:
        '3dc76ef030b979d8264738faa632631b8b6c6764a0bc9185e187a425efa37b69',
    },
    {
      fullName: 'Admin',
      userType: 'admin',
      passwordHash:
        'c8fb58c7405e20898032a03a7490126c9e68f40af6b0d257f74dbc6af3f798f2',
    },
    {
      fullName: 'Manager',
      userType: 'manager',
      passwordHash:
        '58a8665a9cb02561dd1abe65221e29706897e4ad48c285bb90c69483e3964ee0',
    },
    {
      fullName: 'Servicio',
      userType: 'service',
      passwordHash:
        '092be7740be90778cf595f37de68499f1e6cf329b4603e94d049c3262152b4c6',
    },
  ];

  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const user of this.users) {
      await queryRunner.query(
        `INSERT INTO users (full_name, password_hash, user_type) VALUES (?, ?, ?)`,
        [user.fullName, user.passwordHash, user.userType],
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const placeholders = this.users.map(() => '?').join(',');
    await queryRunner.query(
      `DELETE FROM users WHERE full_name IN (${placeholders})`,
      this.users.map((user) => user.fullName),
    );
  }
}
