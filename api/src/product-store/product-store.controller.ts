import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Body,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ProductStoreService } from './product-store.service';
import { DefaultMessagesService } from '../default-messages/default-messages.service';
import { ProductStoreDto } from './dtos/product-store.dto';
import { ProductStoreModal } from './product-store.model';

@ApiTags('productstore')
@Controller('productstore')
export class ProductStoreController {
  constructor(
    private readonly ProductStoreService: ProductStoreService,
    private readonly defaultMessagesService: DefaultMessagesService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo produtoLoja' })
  @ApiBody({ type: ProductStoreDto })
  @ApiResponse({ status: 201, description: 'Produto criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Solicitacao Invalida' })
  async addProduct(
    @Body() productStoreDto: ProductStoreDto,
  ): Promise<{ id: number }> {
    try {
      const generatedId = await this.ProductStoreService.insertProductStore(
        new ProductStoreModal(
          productStoreDto.sell,
          productStoreDto.idProduct,
          productStoreDto.idStore,
        ),
      );
      return { id: generatedId };
    } catch (error) {
      throw new BadRequestException(
        this.defaultMessagesService.INVALID_REQUEST_MSG,
        error.message,
      );
    }
  }

  @Get()
  @ApiOperation({ summary: 'Obter preço de venda do produto' })
  @ApiQuery({ name: 'id', required: false, description: 'ID do produto' })
  async getProductSellPrices(@Query('id') id: number) {
    return this.ProductStoreService.getProductsSellTable(id);
  }

  @Get('byId')
  @ApiOperation({ summary: 'Obter preço de venda especifico' })
  @ApiQuery({ name: 'id', required: false, description: 'ID do produtoLoja' })
  async getProductSellPrice(@Query('id') id: number) {
    return this.ProductStoreService.getProductSellPrice(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar produtoLoja cadastrado por id' })
  @ApiParam({ name: 'id', description: 'ID do produtoLoja' })
  @ApiResponse({ status: 200, description: 'ProdutoLoja deletado com sucesso' })
  @ApiResponse({ status: 400, description: 'Solicitação Inválida' })
  async deleteProductStore(@Param('id') prodId: number): Promise<void> {
    try {
      await this.ProductStoreService.deleteProductStore(prodId);
    } catch (error) {
      throw new BadRequestException(
        this.defaultMessagesService.INVALID_REQUEST_MSG,
        error.message,
      );
    }
  }
}
