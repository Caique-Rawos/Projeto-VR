import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsEntity } from './database/products.entity';
import { ValidationService } from '../validation/validation.service';
import { DefaultMessagesService } from '../default-messages/default-messages.service';
import { ProductStoreService } from 'src/product-store/product-store.service';
import { Repository } from 'typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ProductsEntity])],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    ValidationService,
    DefaultMessagesService,
    ProductStoreService,
    {
      provide: 'ProductStoreEntityRepository',
      useClass: Repository,
    },
  ],
})
export class ProductsModule {}
