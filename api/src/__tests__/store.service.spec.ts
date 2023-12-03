import { Test, TestingModule } from '@nestjs/testing';
import { StoreService } from '../store/store.service';
import { ValidationService } from '../validation/validation.service';
import { DefaultMessagesService } from '../default-messages/default-messages.service';
import { StoreEntity } from '../database/entities/store.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { listStoresEntityMock } from '../__mocks__/store.mock';

describe('StoreService', () => {
  let service: StoreService;
  let defaultMessages: DefaultMessagesService;
  let repository: Repository<StoreEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StoreService,
        ValidationService,
        DefaultMessagesService,
        {
          provide: getRepositoryToken(StoreEntity),
          useValue: {
            query: jest.fn().mockResolvedValue(listStoresEntityMock),
            findOne: jest.fn().mockResolvedValue(listStoresEntityMock),
          },
        },
      ],
    }).compile();

    service = module.get<StoreService>(StoreService);
    defaultMessages = module.get<DefaultMessagesService>(
      DefaultMessagesService,
    );
    repository = module.get<Repository<StoreEntity>>(
      getRepositoryToken(StoreEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Get All Stores', () => {
    it('should return a list of products on getStores', async () => {
      const product = await service.getStores();

      expect(product).toEqual(listStoresEntityMock);
    });
  });

  describe('Get Single Store', () => {
    it('should return a store on getProducts', async () => {
      expect(await service.getSingleStore(1)).toEqual(listStoresEntityMock);
    });

    it('should return an error getProducts (invalid Id)', async () => {
      await expect(service.getSingleStore(1.3)).rejects.toThrow(
        defaultMessages.ID_ERROR_MSG,
      );
    });
  });
});
