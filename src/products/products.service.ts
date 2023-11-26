import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProductModel } from './product.model';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsEntity } from './database/products.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductsEntity)
    private productRepository: Repository<ProductsEntity>,
  ) {}

  async insertProduct(productModel: ProductModel): Promise<number> {
    const { desc, price } = productModel;

    if (!(this.isValidPrice(price) && price !== undefined && price !== null)) {
      throw new BadRequestException('Preço invalido');
    }

    if (!this.isValidDesc(desc)) {
      throw new BadRequestException('Descricao eh obrigatoria');
    }

    const newProduct = new ProductsEntity(desc, price);

    const savedProduct = await this.productRepository.save(newProduct);

    return savedProduct.id;
  }

  async getProducts(): Promise<ProductsEntity[]> {
    return await this.productRepository.find();
  }

  async getSingleProduct(prodId: number): Promise<ProductsEntity | undefined> {
    if (!this.isValidId(prodId)) {
      throw new BadRequestException('ID invalido, esperando um INTEGER');
    }

    return await this.productRepository.findOne({ where: { id: prodId } });
  }

  async updateProduct(
    productId: number,
    desc: string,
    price: number,
  ): Promise<void> {
    if (!this.isValidId(productId)) {
      throw new BadRequestException('ID invalido, esperando um INTEGER');
    }

    if (!this.isValidPrice(price)) {
      throw new BadRequestException('Preco invalido');
    }

    if (!this.isValidDesc(desc)) {
      throw new BadRequestException('Descricao eh obrigatoria');
    }

    const productToUpdate = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!productToUpdate) {
      throw new NotFoundException('Produto nao encontrado');
    }

    productToUpdate.desc = desc;
    productToUpdate.price = price;

    await this.productRepository.save(productToUpdate);
  }

  deleteProduct(prodId: number) {
    if (!this.isValidId(prodId)) {
      throw new BadRequestException('ID invalido, esperando um INTEGER');
    }

    return this.productRepository.delete(prodId);
  }

  /**
   * Verifica se o Id informado é um numero inteiro
   * @param idValue Id informado
   * @returns booleano informando se esta valido
   */
  isValidId(idValue: number): boolean {
    try {
      if (Math.floor(idValue) != idValue) {
        return false;
      }
    } catch (error) {
      return false;
    }

    return true;
  }

  /**
   * Verifica se a Descricao informado não esta vazia
   * @param descValue descricao informada
   * @returns booleano informando se esta valido
   */
  isValidDesc(descValue: string): boolean {
    return descValue && descValue.trim() !== '';
  }

  /**
   * Verifica se o preço informado esta dentro dos parametros estabelecidos pelo banco de dados
   * @param priceValue preço definido
   * @returns booleano informando se esta valido
   */
  isValidPrice(priceValue: number): boolean {
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
