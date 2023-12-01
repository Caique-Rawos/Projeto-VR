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

  /**
   * Faz a inserção do produto no banco de dados
   * @param productModel product model contendo descricao e custo
   * @returns id do produto criado
   */
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

  /**
   * Lista todos os produtos
   * @returns array de todos os produtos cadastrados
   */
  async getProducts(): Promise<ProductsEntity[]> {
    return await this.productRepository.find();
  }

  /**
   * Retorna um produto baseado no Id informado
   * @param prodId id do produto desejado
   * @returns um produto
   */
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

  /**
   * Faz a busca para a consulta dos produtos onde o usuario pode aplicar diversos filtros
   * @param id id do produto
   * @param desc descricao do produto
   * @param price custo do produto
   * @param sell preço de venda do produto
   * @returns lista com os produtos encontados
   */
  async getProductsDataTable(
    id: number,
    desc: string,
    price: string,
    sell: string,
  ) {
    const queryBuilder = this.productRepository
      .createQueryBuilder('produto')
      .select([
        'produto.id as id',
        'produto.descricao as desc',
        'ROUND(produto.custo, 2) as price',
      ])
      .leftJoin('produtoloja', 'p2', 'produto.id = p2.id');

    if (this.isValidId(id)) {
      queryBuilder.andWhere('produto.id = :id', { id });
    }

    if (this.isValidDesc(desc)) {
      queryBuilder.andWhere('produto.descricao ILIKE :desc', {
        desc: `%${desc}%`,
      });
    }

    if (price !== undefined && price.trim() !== '') {
      queryBuilder.andWhere('produto.custo::text ILIKE :price', {
        price: `%${price}%`,
      });
    }

    if (sell !== undefined && sell.trim() !== '') {
      queryBuilder.andWhere('p2.precovenda::text ILIKE :sell', {
        sell: `%${sell}%`,
      });
    }

    return await queryBuilder.getRawMany();
  }

  /**
   * Atualiza as informações de um produto
   * @param productId id do produto
   * @param desc nova descrição
   * @param price novo custo
   */
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

  /**
   * Deleta um produto do banco de dados
   * @param prodId id do produto
   */
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
