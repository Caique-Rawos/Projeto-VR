import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProductModel } from './product.model';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsEntity } from './database/products.entity';
import { Repository } from 'typeorm';

// Estas mensagens tambem sao utilizadas nos testes unitarios
export const ID_ERROR_MSG: string = 'id invalido, esperando um integer';
export const PRICE_ERROR_MSG: string = 'Preco invalido';
export const DESC_ERROR_MSG: string = 'Descricao eh obrigatoria';
export const NOT_FOUND_ERROR_MSG: string = 'Produto nao encontrado';
@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductsEntity)
    private productRepository: Repository<ProductsEntity>,
  ) {}

  async insertProduct(productModel: ProductModel): Promise<number> {
    const { desc, price } = productModel;

    if (!(this.isValidPrice(price) && price !== undefined && price !== null)) {
      throw new BadRequestException(PRICE_ERROR_MSG);
    }

    if (!this.isValidDesc(desc)) {
      throw new BadRequestException(DESC_ERROR_MSG);
    }

    const newProduct = new ProductsEntity(desc, price);

    const savedProduct = await this.productRepository.save(newProduct);

    return savedProduct.id;
  }

  async getProducts(): Promise<ProductsEntity[]> {
    return await this.productRepository.find();
  }

  async getSingleProduct(prodId: number): Promise<ProductsEntity> {
    if (!this.isValidId(prodId)) {
      throw new BadRequestException(ID_ERROR_MSG);
    }
    const product = await this.productRepository.findOne({
      where: { id: prodId },
    });

    if (!product) {
      throw new NotFoundException(NOT_FOUND_ERROR_MSG);
    }

    return product;
  }

  async updateProduct(
    productId: number,
    desc: string,
    price: number,
  ): Promise<void> {
    if (!this.isValidId(productId)) {
      throw new BadRequestException(ID_ERROR_MSG);
    }

    if (!this.isValidPrice(price)) {
      throw new BadRequestException(PRICE_ERROR_MSG);
    }

    if (!this.isValidDesc(desc)) {
      throw new BadRequestException(DESC_ERROR_MSG);
    }

    const productToUpdate = await this.getSingleProduct(productId);

    productToUpdate.desc = desc;
    productToUpdate.price = price;

    await this.productRepository.save(productToUpdate);
  }

  async deleteProduct(prodId: number) {
    if (!this.isValidId(prodId)) {
      throw new BadRequestException(ID_ERROR_MSG);
    }

    await this.productRepository.delete(prodId);
  }

  /**
   * Verifica se o Id informado é um numero inteiro
   * @param idValue Id informado
   * @returns booleano informando se esta valido
   */
  isValidId(idValue: number): boolean {
    try {
      if (!idValue) {
        return false;
      }
      return Math.floor(idValue) == idValue;
    } catch (error) {
      return false;
    }
  }

  /**
   * Verifica se a Descricao informado não esta vazia
   * @param descValue descricao informada
   * @returns booleano informando se esta valido
   */
  isValidDesc(descValue: string): boolean {
    if (!descValue) {
      return false;
    }
    return descValue && descValue.trim() !== '';
  }

  /**
   * Verifica se o preço informado esta dentro dos parametros estabelecidos pelo banco de dados
   * @param priceValue preço definido
   * @returns booleano informando se esta valido
   */
  isValidPrice(priceValue: number): boolean {
    if (!priceValue) {
      return false;
    }
    const stringValue = priceValue.toString();
    const [integerPart, decimalPart] = stringValue.split('.');

    if (integerPart.length > 10) {
      return false;
    }

    if (decimalPart && decimalPart.length > 3) {
      return false;
    }

    return true;
  }
}
