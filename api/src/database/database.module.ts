import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductStoreEntity } from '../product-store/database/productStore.entity';
import { ProductsEntity } from '../products/database/products.entity';
import { StoreEntity } from '../store/database/store.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
      entities: [ProductsEntity, ProductStoreEntity, StoreEntity],
      synchronize: true,
    }),
  ],
})
export class DatabaseModule {}
