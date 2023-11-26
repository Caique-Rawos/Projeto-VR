import { Test, TestingModule } from '@nestjs/testing';
import {
  DESC_ERROR_MSG,
  PRICE_ERROR_MSG,
  ProductsService,
} from '../products.service';
import { Repository } from 'typeorm';
import { ProductsEntity } from '../database/products.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { productsEntityMock } from '../__mocks__/products.mock';
import {
  createCorrectProductMock,
  createEmptyDescProductMock,
  createInvalidPriceProductMock,
} from '../__mocks__/createProduct.mock';
import { ProductModel } from '../product.model';

describe('ProductsService', () => {
  let service: ProductsService;
  let productRepository: Repository<ProductsEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(ProductsEntity),
          useValue: {
            save: jest.fn().mockResolvedValue(productsEntityMock),
            findOne: jest.fn().mockResolvedValue(productsEntityMock),
            find: jest.fn().mockResolvedValue(productsEntityMock),
            delete: jest.fn().mockResolvedValue(productsEntityMock),
          },
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    productRepository = module.get<Repository<ProductsEntity>>(
      getRepositoryToken(ProductsEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(productRepository).toBeDefined();
  });

  /*
    +---------------------+
    |       INSERTS       |
    +---------------------+
  */

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
    ).rejects.toThrow(DESC_ERROR_MSG);
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
    ).rejects.toThrow(PRICE_ERROR_MSG);
  });

  /*
    +---------------------+
    |   GET ALL PRODUCT   |
    +---------------------+
  */

  it('should return a list of products on getProducts', async () => {
    const product = await service.getProducts();

    expect(product).toEqual(productsEntityMock);
  });

  /*
    +----------------------+
    |  GET SINGLE PRODUCT  |
    +----------------------+
  */

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
    jest.spyOn(productRepository, 'findOne').mockRejectedValueOnce(new Error());

    await expect(
      service.getSingleProduct(productsEntityMock.id),
    ).rejects.toThrow();
  });

  /*
    +---------------------+
    |       UPDATES       |
    +---------------------+
  */

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
    ).rejects.toThrow(DESC_ERROR_MSG);
  });

  it('should return an error on updateProduct (price)', async () => {
    await expect(
      service.updateProduct(
        productsEntityMock.id,
        productsEntityMock.desc,
        createInvalidPriceProductMock.price,
      ),
    ).rejects.toThrow(PRICE_ERROR_MSG);
  });

  /*
    +---------------------+
    |       DELETES       |
    +---------------------+
  */

  it('should return an error in deleteProduct (ID)', async () => {
    await expect(service.deleteProduct(1.3)).rejects.toThrow();
  });

  it('should return nothing on deleteProduct', async () => {
    const product = await service.deleteProduct(productsEntityMock.id);

    expect(product).toEqual(undefined);
  });

  /*
    +---------------------+
    |      VALID IDS      |
    +---------------------+
  */

  it('should return true on isValidId (mock id)', async () => {
    const bool = await service.isValidId(productsEntityMock.id);

    expect(bool).toEqual(true);
  });

  it('should return false on isValidId (1.3)', async () => {
    const bool = await service.isValidId(1.3);

    expect(bool).toEqual(false);
  });

  it('should return false on isValidId (undefined)', async () => {
    const bool = await service.isValidId(undefined);

    expect(bool).toEqual(false);
  });

  /*
    +---------------------+
    |     VALID PRICE     |
    +---------------------+
  */

  it('should return true on isValidPrice (mock price)', async () => {
    const bool = await service.isValidPrice(productsEntityMock.price);

    expect(bool).toEqual(true);
  });

  it('should return true on isValidPrice (0.001)', async () => {
    const bool = await service.isValidPrice(0.001);

    expect(bool).toEqual(true);
  });

  it('should return true on isValidPrice (1234567890.999)', async () => {
    const bool = await service.isValidPrice(1234567890.999);

    expect(bool).toEqual(true);
  });

  it('should return false on isValidPrice (mock invalid price)', async () => {
    const bool = await service.isValidPrice(
      createInvalidPriceProductMock.price,
    );

    expect(bool).toEqual(false);
  });

  it('should return false on isValidPrice (0.0009)', async () => {
    const bool = await service.isValidPrice(0.0009);

    expect(bool).toEqual(false);
  });

  it('should return false on isValidPrice (12345678901)', async () => {
    const bool = await service.isValidPrice(12345678901);

    expect(bool).toEqual(false);
  });

  it('should return false on isValidPrice (1234567890.5426)', async () => {
    const bool = await service.isValidPrice(1234567890.5426);

    expect(bool).toEqual(false);
  });

  it('should return false on isValidPrice (undefined)', async () => {
    const bool = await service.isValidPrice(undefined);

    expect(bool).toEqual(false);
  });

  /*
    +----------------------+
    |      VALID DESC      |
    +----------------------+
  */

  it('should return true on isValidDesc (mock desc)', async () => {
    const bool = await service.isValidDesc(productsEntityMock.desc);

    expect(bool).toEqual(true);
  });

  it('should return true on isValidDesc (test)', async () => {
    const bool = await service.isValidDesc('test');

    expect(bool).toEqual(true);
  });

  it('should return true on isValidDesc (t)', async () => {
    const bool = await service.isValidDesc('t');

    expect(bool).toEqual(true);
  });

  it('should return false on isValidDesc (empty mock)', async () => {
    const bool = await service.isValidDesc(createEmptyDescProductMock.desc);

    expect(bool).toEqual(false);
  });

  it('should return false on isValidDesc (empty string)', async () => {
    const bool = await service.isValidDesc('');

    expect(bool).toEqual(false);
  });

  it('should return false on isValidDesc (spaces)', async () => {
    const bool = await service.isValidDesc('   ');

    expect(bool).toEqual(false);
  });

  it('should return false on isValidDesc (undefined)', async () => {
    const bool = await service.isValidDesc(undefined);

    expect(bool).toEqual(false);
  });
});
