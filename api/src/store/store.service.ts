import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { StoreEntity } from '../database/entities/store.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ValidationService } from '../validation/validation.service';
import { DefaultMessagesService } from '../default-messages/default-messages.service';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(StoreEntity)
    private storeRepository: Repository<StoreEntity>,
    private readonly validationService: ValidationService,
    private readonly defaultMessagesService: DefaultMessagesService,
  ) {}

  /**
   * Lista todas as lojas
   * @returns array de todas as lojas cadastradas
   */
  async getStores(): Promise<StoreEntity[]> {
    const customQuery = `SELECT id, id || ' - ' || descricao as desc
    FROM loja l`;

    return await this.storeRepository.query(customQuery);
  }

  /**
   * Retorna uma loja baseado no Id informado
   * @param storeId id da loja desejada
   * @returns uma loja
   */
  async getSingleStore(storeId: number): Promise<StoreEntity> {
    console.log('start');
    console.log(storeId);
    if (!this.validationService.isValidId(storeId)) {
      console.log('invalid');
      throw new BadRequestException(this.defaultMessagesService.ID_ERROR_MSG);
    }
    const product = await this.storeRepository.findOne({
      where: { id: storeId },
    });

    console.log(product);

    if (!product) {
      console.log('invalid product');
      throw new NotFoundException(
        this.defaultMessagesService.NOT_FOUND_ERROR_MSG,
      );
    }

    console.log(product);
    console.log('end');

    return product;
  }
}
