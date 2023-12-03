import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProductStoreEntity } from '../database/entities/productStore.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ValidationService } from '../validation/validation.service';
import { DefaultMessagesService } from '../default-messages/default-messages.service';
import { ProductStoreModel } from './product-store.model';
import { Console } from 'console';

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
    productStoreModel: ProductStoreModel,
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

    if ((await this.getProductSellDuplicity(idProduct, idStore)) != null) {
      throw new BadRequestException(
        this.defaultMessagesService.PRODUCT_STORE_DUPLICITY_MSG,
      );
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
   * Verica se o preço de um produto ja existe em uma loja
   * @param idProduct id do produto
   * @param idStore id da loja
   * @returns produtoLoja
   */
  async getProductSellDuplicity(idProduct: number, idStore: number) {
    if (
      this.validationService.isValidId(idProduct) &&
      this.validationService.isValidId(idStore)
    ) {
      return await this.productStoreRepository
        .createQueryBuilder('produtoloja')
        .select('*')
        .where('idproduto = :idProduct', { idProduct: idProduct })
        .andWhere('idloja = :idStore', { idStore: idStore })
        .getRawOne();
    } else {
      throw new BadRequestException(this.defaultMessagesService.ID_ERROR_MSG);
    }
  }

  /**
   * Retorna um produtoLoja baseado no Id informado
   * @param prodStoreId id do produtoLoja desejado
   * @returns um produtoloja
   */
  async getSingleProductStore(
    prodStoreId: number,
  ): Promise<ProductStoreEntity> {
    if (!this.validationService.isValidId(prodStoreId)) {
      throw new BadRequestException(this.defaultMessagesService.ID_ERROR_MSG);
    }
    const product = await this.productStoreRepository.findOne({
      where: { id: prodStoreId },
    });

    if (!product) {
      throw new NotFoundException(
        this.defaultMessagesService.NOT_FOUND_ERROR_MSG,
      );
    }

    return product;
  }

  /**
   * Atualiza o produtoLoja
   * @param prodStoreId id do produtoLoja
   * @param sell preço de venda
   */
  async updateProductStore(prodStoreId: number, sell: number): Promise<void> {
    if (!this.validationService.isValidPrice(sell)) {
      throw new BadRequestException(
        this.defaultMessagesService.PRICE_ERROR_MSG,
      );
    }

    const productToUpdate = await this.getSingleProductStore(prodStoreId);

    productToUpdate.sell = sell;

    await this.productStoreRepository.save(productToUpdate);
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
