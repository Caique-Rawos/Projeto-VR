import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProductModel } from './product.model';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsEntity } from './database/products.entity';
import { Repository } from 'typeorm';
import { ValidationService } from '../validation/validation.service';
import { DefaultMessagesService } from '../default-messages/default-messages.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductsEntity)
    private productRepository: Repository<ProductsEntity>,
    private readonly validationService: ValidationService,
    private readonly defaultMessagesService: DefaultMessagesService,
  ) {}

  /**
   * Faz a inserção do produto no banco de dados
   * @param productModel product model contendo descricao e custo
   * @returns id do produto criado
   */
  async insertProduct(productModel: ProductModel): Promise<number> {
    const { desc, price } = productModel;

    if (
      !(
        this.validationService.isValidPrice(price) &&
        price !== undefined &&
        price !== null
      )
    ) {
      throw new BadRequestException(
        this.defaultMessagesService.PRICE_ERROR_MSG,
      );
    }

    if (!this.validationService.isValidDesc(desc)) {
      throw new BadRequestException(this.defaultMessagesService.DESC_ERROR_MSG);
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
    if (!this.validationService.isValidId(prodId)) {
      throw new BadRequestException(this.defaultMessagesService.ID_ERROR_MSG);
    }
    const product = await this.productRepository.findOne({
      where: { id: prodId },
    });

    if (!product) {
      throw new NotFoundException(
        this.defaultMessagesService.NOT_FOUND_ERROR_MSG,
      );
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
        'distinct on (produto.id) produto.id as id',
        'produto.descricao as desc',
        'ROUND(produto.custo, 2) as price',
      ])
      .leftJoin('produtoloja', 'p2', 'produto.id = p2.idproduto');

    if (this.validationService.isValidId(id)) {
      queryBuilder.andWhere('produto.id = :id', { id });
    } else if (id) {
      return [];
    }

    if (this.validationService.isValidDesc(desc)) {
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
    if (!this.validationService.isValidId(productId)) {
      throw new BadRequestException(this.defaultMessagesService.ID_ERROR_MSG);
    }

    if (!this.validationService.isValidPrice(price)) {
      throw new BadRequestException(
        this.defaultMessagesService.PRICE_ERROR_MSG,
      );
    }

    if (!this.validationService.isValidDesc(desc)) {
      throw new BadRequestException(this.defaultMessagesService.DESC_ERROR_MSG);
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
    if (!this.validationService.isValidId(prodId)) {
      throw new BadRequestException(this.defaultMessagesService.ID_ERROR_MSG);
    }

    await this.productRepository.delete(prodId);
  }
}
