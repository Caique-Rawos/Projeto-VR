import { Module } from '@nestjs/common';
import { ProductStoreService } from './product-store.service';
import { ProductStoreController } from './product-store.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductStoreEntity } from '../database/entities/productStore.entity';
import { ValidationService } from '../validation/validation.service';
import { DefaultMessagesService } from '../default-messages/default-messages.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductStoreEntity])],
  providers: [ProductStoreService, ValidationService, DefaultMessagesService],
  controllers: [ProductStoreController],
})
export class ProductStoreModule {}
