import { Test, TestingModule } from '@nestjs/testing';
import { StoreService } from '../store.service';
import { ValidationService } from '../../validation/validation.service';
import { DefaultMessagesService } from '../../default-messages/default-messages.service';
import { StoreEntity } from '../database/store.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('StoreService', () => {
  let service: StoreService;
  let repository: Repository<StoreEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StoreService,
        ValidationService,
        DefaultMessagesService,
        {
          provide: getRepositoryToken(StoreEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<StoreService>(StoreService);
    repository = module.get<Repository<StoreEntity>>(
      getRepositoryToken(StoreEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
