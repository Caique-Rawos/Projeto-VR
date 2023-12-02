import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from '../products.service';
import { Repository } from 'typeorm';
import { ProductsEntity } from '../database/products.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  listProductsEntityMock,
  productsEntityMock,
} from '../__mocks__/products.mock';
import {
  createCorrectProductMock,
  createEmptyDescProductMock,
  createInvalidPriceProductMock,
} from '../__mocks__/createProduct.mock';
import { ProductModel } from '../product.model';
import { ValidationService } from '../../validation/validation.service';
import { DefaultMessagesService } from '../../default-messages/default-messages.service';

describe('ProductsService', () => {
  let service: ProductsService;
  let defaultMessages: DefaultMessagesService;
  let productRepository: Repository<ProductsEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        ValidationService,
        DefaultMessagesService,
        {
          provide: getRepositoryToken(ProductsEntity),
          useValue: {
            save: jest.fn().mockResolvedValue(productsEntityMock),
            findOne: jest.fn().mockResolvedValue(productsEntityMock),
            find: jest.fn().mockResolvedValue(productsEntityMock),
            delete: jest.fn().mockResolvedValue(productsEntityMock),
            createQueryBuilder: jest.fn(() => ({
              select: jest.fn().mockReturnThis(),
              from: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              leftJoin: jest.fn().mockReturnThis(),
              getRawMany: jest.fn().mockResolvedValue(listProductsEntityMock),
            })),
          },
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    defaultMessages = module.get<DefaultMessagesService>(
      DefaultMessagesService,
    );
    productRepository = module.get<Repository<ProductsEntity>>(
      getRepositoryToken(ProductsEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(defaultMessages).toBeDefined();
    expect(productRepository).toBeDefined();
  });

  /*
    +---------------------+
    |       INSERTS       |
    +---------------------+
  */
  describe('Inserts', () => {
    it('should return a Product id on insertProduct', async () => {
      const product = await service.insertProduct(
        new ProductModel(
          createCorrectProductMock.desc,
          createCorrectProductMock.price,
          '',
        ),
      );

      expect(product).toEqual(productsEntityMock.id);
    });

    it('should return an error on insertProduct (desc)', async () => {
      await expect(
        service.insertProduct(
          new ProductModel(
            createEmptyDescProductMock.desc,
            createEmptyDescProductMock.price,
            '',
          ),
        ),
      ).rejects.toThrow(defaultMessages.DESC_ERROR_MSG);
    });

    it('should return an error on insertProduct (price)', async () => {
      await expect(
        service.insertProduct(
          new ProductModel(
            createInvalidPriceProductMock.desc,
            createInvalidPriceProductMock.price,
            '',
          ),
        ),
      ).rejects.toThrow(defaultMessages.PRICE_ERROR_MSG);
    });
  });

  /*
    +---------------------+
    |   GET ALL PRODUCT   |
    +---------------------+
  */
  describe('Get All Product', () => {
    it('should return a list of products on getProducts', async () => {
      const product = await service.getProducts();

      expect(product).toEqual(productsEntityMock);
    });
  });

  /*
    +----------------------+
    |  GET SINGLE PRODUCT  |
    +----------------------+
  */
  describe('Get Single Product', () => {
    it('should return a product in getSingleProduct', async () => {
      const product = await service.getSingleProduct(productsEntityMock.id);

      expect(product).toEqual(productsEntityMock);
    });

    it('should return an error in getSingleProduct (ID)', async () => {
      await expect(service.getSingleProduct(1.3)).rejects.toThrow();
    });

    it('should return an error in getSingleProduct (undefined)', async () => {
      jest.spyOn(productRepository, 'findOne').mockResolvedValue(undefined);

      await expect(
        service.getSingleProduct(productsEntityMock.id),
      ).rejects.toThrow();
    });

    it('should return an error in getSingleProduct (Error BD)', async () => {
      jest
        .spyOn(productRepository, 'findOne')
        .mockRejectedValueOnce(new Error());

      await expect(
        service.getSingleProduct(productsEntityMock.id),
      ).rejects.toThrow();
    });
  });

  /*
    +---------------------+
    |      DATA TABLE     |
    +---------------------+
  */
  describe('Data Table', () => {
    it('should return a list of all the products on getProductsDataTable', async () => {
      const product = await service.getProductsDataTable(null, '', '', '');

      expect(product).toEqual(listProductsEntityMock);
    });

    it('should return a empty list on getProductsDataTable', async () => {
      const product = await service.getProductsDataTable(1.2, '', '', '');

      expect(product).toEqual([]);
    });
  });

  /*
    +---------------------+
    |       UPDATES       |
    +---------------------+
  */
  describe('Updates', () => {
    it('should return nothing on updateProduct', async () => {
      const product = await service.updateProduct(
        productsEntityMock.id,
        'Teste Atualiza',
        149.95,
      );

      expect(product).toEqual(undefined);
    });

    it('should return an error in updateProduct (ID)', async () => {
      await expect(
        service.updateProduct(
          1.3,
          productsEntityMock.desc,
          productsEntityMock.price,
        ),
      ).rejects.toThrow();
    });

    it('should return an error on updateProduct (desc)', async () => {
      await expect(
        service.updateProduct(
          productsEntityMock.id,
          createEmptyDescProductMock.desc,
          productsEntityMock.price,
        ),
      ).rejects.toThrow(defaultMessages.DESC_ERROR_MSG);
    });

    it('should return an error on updateProduct (price)', async () => {
      await expect(
        service.updateProduct(
          productsEntityMock.id,
          productsEntityMock.desc,
          createInvalidPriceProductMock.price,
        ),
      ).rejects.toThrow(defaultMessages.PRICE_ERROR_MSG);
    });
  });

  /*
    +---------------------+
    |       DELETES       |
    +---------------------+
  */
  describe('Deletes', () => {
    it('should return an error in deleteProduct (ID)', async () => {
      await expect(service.deleteProduct(1.3)).rejects.toThrow();
    });

    it('should return nothing on deleteProduct', async () => {
      const product = await service.deleteProduct(productsEntityMock.id);

      expect(product).toEqual(undefined);
    });
  });
});
