import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import configuration from './config/configuration';
import { DatabaseModule } from './database/database.module';
import { InventoryModule } from './inventory/inventory.module';
import { SalesModule } from './sales/sales.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load: [configuration],
      expandVariables: true,
    }),
    DatabaseModule,
    UsersModule,
    InventoryModule,
    AuthModule,
    SalesModule,
  ],
})
export class AppModule {}
