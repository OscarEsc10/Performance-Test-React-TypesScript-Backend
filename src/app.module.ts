import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmConfig } from './config/typeorm.config';
import { ProductsModule } from './modules/products/product.module';
import { UsersModule } from './modules/users/users.modules';
import { DataSource } from 'typeorm';
import { OnModuleInit } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forRoot(TypeOrmConfig), ProductsModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly dataSource: DataSource) {}

  async onModuleInit() {
    try {
      // Ensure the DataSource is initialized by TypeORM module
      if (!this.dataSource.isInitialized) {
        await this.dataSource.initialize();
      }
      // eslint-disable-next-line no-console
      console.info('[DB] Connection established successfully.');
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error(`[DB] Failed to establish connection: ${err?.message || err}`);
      throw err;
    }
  }
}
