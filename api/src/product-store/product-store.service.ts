import { BadRequestException, Injectable } from '@nestjs/common';
import { ProductStoreEntity } from './database/productStore.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ValidationService } from '../validation/validation.service';
import { DefaultMessagesService } from '../default-messages/default-messages.service';

@Injectable()
export class ProductStoreService {
  constructor(
    @InjectRepository(ProductStoreEntity)
    private ProductStoreRepository: Repository<ProductStoreEntity>,
    private readonly validationService: ValidationService,
    private readonly defaultMessagesService: DefaultMessagesService,
  ) {}

  /**
   * Deleta os produtoLoja desse produto do banco de dados
   * @param prodId id do produto
   */
  async deleteProductStore(prodId: number) {
    if (!this.validationService.isValidId(prodId)) {
      throw new BadRequestException(this.defaultMessagesService.ID_ERROR_MSG);
    }

    await this.ProductStoreRepository.createQueryBuilder('produtoloja')
      .delete()
      .where('idproduto = :id', { id: prodId })
      .execute();
  }
}
