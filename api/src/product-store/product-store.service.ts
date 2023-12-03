import { BadRequestException, Injectable } from '@nestjs/common';
import { ProductStoreEntity } from './database/productStore.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ValidationService } from '../validation/validation.service';
import { DefaultMessagesService } from '../default-messages/default-messages.service';
import { ProductStoreModal } from './product-store.model';

@Injectable()
export class ProductStoreService {
  constructor(
    @InjectRepository(ProductStoreEntity)
    private productStoreRepository: Repository<ProductStoreEntity>,
    private readonly validationService: ValidationService,
    private readonly defaultMessagesService: DefaultMessagesService,
  ) {}

  /**
   * Faz a inserção do produto no banco de dados
   * @param productModel product model contendo descricao e custo
   * @returns id do produto criado
   */
  async insertProductStore(
    productStoreModel: ProductStoreModal,
  ): Promise<number> {
    const { sell, idProduct, idStore } = productStoreModel;

    if (
      !(
        this.validationService.isValidPrice(sell) &&
        sell !== undefined &&
        sell !== null
      )
    ) {
      throw new BadRequestException(
        this.defaultMessagesService.PRICE_ERROR_MSG,
      );
    }

    if (!this.validationService.isValidId(idProduct)) {
      throw new BadRequestException(this.defaultMessagesService.ID_ERROR_MSG);
    }

    if (!this.validationService.isValidId(idStore)) {
      throw new BadRequestException(this.defaultMessagesService.ID_ERROR_MSG);
    }

    const newProduct = new ProductStoreEntity(sell, idProduct, idStore);

    const savedProduct = await this.productStoreRepository.save(newProduct);

    return savedProduct.id;
  }

  /**
   * Faz a busca para a consulta dos preços de venda dos produtos
   * @param id id do produto
   * @returns lista com os preços encontados e a descricao da loja
   */
  async getProductsSellTable(id: number) {
    if (this.validationService.isValidId(id)) {
      return await this.productStoreRepository
        .createQueryBuilder('produtoloja')
        .select("l.id || ' - ' || l.descricao", 'store')
        .addSelect('ROUND(COALESCE(produtoloja.precovenda, 0), 2)', 'sellprice')
        .addSelect('produtoloja.id', 'id')
        .addSelect('l.id', 'idLoja')
        .innerJoin('loja', 'l', 'l.id = produtoloja.idloja')
        .where('produtoloja.idproduto = :id', { id })
        .getRawMany();
    } else {
      return [];
    }
  }

  /**
   * Faz a busca para a consulta de 1 preço de venda
   * @param id id do produtoLoja
   * @returns lista com os preços encontados e a descricao da loja
   */
  async getProductSellPrice(id: number) {
    if (this.validationService.isValidId(id)) {
      return await this.productStoreRepository
        .createQueryBuilder('produtoloja')
        .select('ROUND(COALESCE(precovenda, 0), 2) as price')
        .addSelect('idloja as id')
        .where('id = :id', { id: id })
        .getRawOne();
    } else {
      return [];
    }
  }

  /**
   * Deleta os produtoLoja desse produto do banco de dados
   * @param prodId id do produto
   */
  async deleteProductStore(prodId: number) {
    if (!this.validationService.isValidId(prodId)) {
      throw new BadRequestException(this.defaultMessagesService.ID_ERROR_MSG);
    }

    await this.productStoreRepository.delete(prodId);
  }
}
