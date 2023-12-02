import { Test, TestingModule } from '@nestjs/testing';
import { ProductStoreService } from '../product-store.service';
import { ValidationService } from '../../validation/validation.service';
import { DefaultMessagesService } from '../../default-messages/default-messages.service';
import { ProductStoreEntity } from '../database/productStore.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('ProductStoreService', () => {
  let service: ProductStoreService;
  let repository: Repository<ProductStoreEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductStoreService,
        ValidationService,
        DefaultMessagesService,
        {
          provide: getRepositoryToken(ProductStoreEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<ProductStoreService>(ProductStoreService);
    repository = module.get<Repository<ProductStoreEntity>>(
      getRepositoryToken(ProductStoreEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
