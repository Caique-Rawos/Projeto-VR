import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductStoreEntity } from '../database/entities/productStore.entity';
import { ProductsEntity } from './entities/products.entity';
import { StoreEntity } from './entities/store.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      username: 'postgres',
      password: 'postgres',
      database: 'projeto_vr',
      entities: [ProductsEntity, ProductStoreEntity, StoreEntity],
      synchronize: true,
    }),
  ],
})
export class DatabaseModule {}
