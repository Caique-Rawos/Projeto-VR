import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsEntity } from 'src/products/database/products.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      username: 'postgres',
      password: 'postgre',
      database: 'postgres',
      entities: [ProductsEntity],
      synchronize: true,
    }),
  ],
})
export class DatabaseModule {}
