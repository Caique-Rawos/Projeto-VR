import { Test, TestingModule } from '@nestjs/testing';
import { ProductStoreService } from '../product-store/product-store.service';
import { ValidationService } from '../validation/validation.service';
import { DefaultMessagesService } from '../default-messages/default-messages.service';
import { ProductStoreEntity } from '../database/entities/productStore.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductStoreModel } from '../product-store/product-store.model';
import { createCorrectProductStoreMock } from '../__mocks__/productStore.mock';
import { BadRequestException } from '@nestjs/common';

describe('ProductStoreService', () => {
  let service: ProductStoreService;
  let defaultMessages: DefaultMessagesService;
  let repository: Repository<ProductStoreEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductStoreService,
        ValidationService,
        DefaultMessagesService,
        {
          provide: getRepositoryToken(ProductStoreEntity),
          useValue: {
            save: jest.fn().mockResolvedValue(createCorrectProductStoreMock),
            findOne: jest.fn().mockResolvedValue(createCorrectProductStoreMock),
            find: jest.fn().mockResolvedValue([createCorrectProductStoreMock]),
            delete: jest.fn().mockResolvedValue(undefined),
            createQueryBuilder: jest.fn(() => ({
              select: jest.fn().mockReturnThis(),
              addSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getRawOne: jest
                .fn()
                .mockResolvedValue(createCorrectProductStoreMock),
            })),
          },
        },
      ],
    }).compile();

    service = module.get<ProductStoreService>(ProductStoreService);
    defaultMessages = module.get<DefaultMessagesService>(
      DefaultMessagesService,
    );
    repository = module.get<Repository<ProductStoreEntity>>(
      getRepositoryToken(ProductStoreEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Inserts', () => {
    it('should return a ProductStore id on insertProductStore', async () => {
      try {
        const product = await service.insertProductStore(
          new ProductStoreModel(
            createCorrectProductStoreMock.sell,
            createCorrectProductStoreMock.idProduct,
            221,
          ),
        );

        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe(defaultMessages.PRODUCT_STORE_DUPLICITY_MSG);
      }
    });

    it('should return an error on insertProductStore (duplicity)', async () => {
      await expect(
        service.insertProductStore(
          new ProductStoreModel(
            createCorrectProductStoreMock.sell,
            createCorrectProductStoreMock.idProduct,
            createCorrectProductStoreMock.idStore,
          ),
        ),
      ).rejects.toThrow(defaultMessages.PRODUCT_STORE_DUPLICITY_MSG);
    });

    it('should return an error on insertProductStore (sell)', async () => {
      await expect(
        service.insertProductStore(
          new ProductStoreModel(
            99.9564,
            createCorrectProductStoreMock.idProduct,
            createCorrectProductStoreMock.idStore,
          ),
        ),
      ).rejects.toThrow(defaultMessages.PRICE_ERROR_MSG);
    });

    it('should return an error on insertProductStore (idProduct)', async () => {
      await expect(
        service.insertProductStore(
          new ProductStoreModel(
            createCorrectProductStoreMock.sell,
            1.3,
            createCorrectProductStoreMock.idStore,
          ),
        ),
      ).rejects.toThrow(defaultMessages.ID_ERROR_MSG);
    });

    it('should return an error on insertProductStore (idStore)', async () => {
      await expect(
        service.insertProductStore(
          new ProductStoreModel(
            createCorrectProductStoreMock.sell,
            createCorrectProductStoreMock.idProduct,
            12.2,
          ),
        ),
      ).rejects.toThrow(defaultMessages.ID_ERROR_MSG);
    });
  });

  describe('Get Products Sell Table', () => {
    it('should return an empty list on getProductsSellTable (invalid id)', async () => {
      const products = await service.getProductsSellTable(1.3);

      expect(products).toEqual([]);
    });
  });

  describe('Get Product Sell Price', () => {
    it('should return a product sell price on getProductSellPrice', async () => {
      const product = await service.getProductSellPrice(
        createCorrectProductStoreMock.id,
      );

      expect(product).toEqual(createCorrectProductStoreMock);
    });

    it('should return an empty list on getProductSellPrice (invalid id)', async () => {
      const product = await service.getProductSellPrice(1.3);

      expect(product).toEqual([]);
    });
  });

  describe('Get Product Sell Duplicity', () => {
    it('should return a productLoja on getProductSellDuplicity', async () => {
      const productLoja = await service.getProductSellDuplicity(
        createCorrectProductStoreMock.idProduct,
        createCorrectProductStoreMock.idStore,
      );

      expect(productLoja).toEqual(createCorrectProductStoreMock);
    });

    it('should throw an error on getProductSellDuplicity (invalid id)', async () => {
      await expect(
        service.getProductSellDuplicity(
          1.3,
          createCorrectProductStoreMock.idStore,
        ),
      ).rejects.toThrow(defaultMessages.ID_ERROR_MSG);
    });
  });

  describe('Get Single Product Store', () => {
    it('should return a single productLoja on getSingleProductStore', async () => {
      const result = await service.getSingleProductStore(1);
      expect(result).toEqual(createCorrectProductStoreMock);
    });

    it('should throw an error on getSingleProductStore (invalid id)', async () => {
      await expect(service.getSingleProductStore(1.3)).rejects.toThrow(
        defaultMessages.ID_ERROR_MSG,
      );
    });
  });

  describe('Update Product Store', () => {
    it('should update productLoja on updateProductStore', async () => {
      await service.updateProductStore(1, createCorrectProductStoreMock.sell);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });

      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          sell: createCorrectProductStoreMock.sell,
          idProduct: createCorrectProductStoreMock.idProduct,
          idStore: createCorrectProductStoreMock.idStore,
        }),
      );
    });

    it('should throw an error on updateProductStore (invalid sell)', async () => {
      await expect(
        service.updateProductStore(createCorrectProductStoreMock.id, 99.9999),
      ).rejects.toThrow(defaultMessages.PRICE_ERROR_MSG);
    });

    it('should throw an error on updateProductStore (not found)', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);

      await expect(service.updateProductStore(12, 99.9)).rejects.toThrow(
        defaultMessages.NOT_FOUND_ERROR_MSG,
      );
    });
  });

  describe('Delete Product Store', () => {
    it('should delete productLoja on deleteProductStore', async () => {
      await service.deleteProductStore(createCorrectProductStoreMock.id);

      expect(repository.delete).toHaveBeenCalledWith(
        createCorrectProductStoreMock.id,
      );
    });

    it('should throw an error on deleteProductStore (invalid id)', async () => {
      await expect(service.deleteProductStore(12.2)).rejects.toThrow(
        defaultMessages.ID_ERROR_MSG,
      );
    });
  });
});
