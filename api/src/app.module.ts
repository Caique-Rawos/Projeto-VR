import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { DatabaseModule } from './database/database.module';
import { ProductStoreModule } from './product-store/product-store.module';
import { ValidationService } from './validation/validation.service';
import { DefaultMessagesService } from './default-messages/default-messages.service';
import { StoreModule } from './store/store.module';

@Module({
  imports: [ProductsModule, DatabaseModule, ProductStoreModule, StoreModule],
  controllers: [AppController],
  providers: [AppService, ValidationService, DefaultMessagesService],
})
export class AppModule {}
