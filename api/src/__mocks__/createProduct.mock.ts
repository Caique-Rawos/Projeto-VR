import { ProductsDto } from '../products/dtos/products.dto';

export const createCorrectProductMock: ProductsDto = {
  desc: 'Produto Teste',
  price: 149.9,
  image: null,
};

export const createEmptyDescProductMock: ProductsDto = {
  desc: '',
  price: 149.9,
  image: null,
};

export const createInvalidPriceProductMock: ProductsDto = {
  desc: 'Produto Teste',
  price: 12345678901.001,
  image: null,
};
