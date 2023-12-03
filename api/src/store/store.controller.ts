import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StoreService } from './store.service';
import { StoreModel } from './store.model';
import { DefaultMessagesService } from '../default-messages/default-messages.service';

@ApiTags('store')
@Controller('store')
export class StoreController {
  constructor(
    private readonly storeService: StoreService,
    private readonly defaultMessagesService: DefaultMessagesService,
  ) {}

  @Get('all')
  @ApiOperation({ summary: 'Buscar todos as lojas cadastradas' })
  @ApiResponse({
    status: 200,
    description: 'Lista de lojas obtida com sucesso',
  })
  async getAllStores(): Promise<StoreModel[]> {
    return this.storeService.getStores();
  }

  @Get()
  @ApiOperation({ summary: 'Buscar loja cadastrada por Id' })
  @ApiQuery({ name: 'id', required: false, description: 'ID da loja' })
  @ApiResponse({ status: 200, description: 'loja obtida com sucesso' })
  @ApiResponse({ status: 404, description: 'loja nao encontrada' })
  async getStore(@Query('id') storeId: number): Promise<StoreModel | null> {
    try {
      return await this.storeService.getSingleStore(storeId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else {
        throw new BadRequestException(
          this.defaultMessagesService.INVALID_REQUEST_MSG,
          error.message,
        );
      }
    }
  }
}
