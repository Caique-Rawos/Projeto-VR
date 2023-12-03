import { ProductsEntity } from '../database/entities/products.entity';

export const productsEntityMock: ProductsEntity = {
  id: 1,
  desc: 'Produto Teste',
  price: 99.9,
  image: null,
};

export const listProductsEntityMock: ProductsEntity[] = [
  {
    id: 1,
    desc: 'Produto Teste',
    price: 99.9,
    image: null,
  },
  {
    id: 2,
    desc: 'anel de prata',
    price: 150,
    image: null,
  },
  {
    id: 3,
    desc: 'anel de ouro',
    price: 300,
    image: null,
  },
];
