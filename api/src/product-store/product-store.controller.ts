import { BadRequestException, Controller, Delete, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductStoreService } from './product-store.service';
import { DefaultMessagesService } from 'src/default-messages/default-messages.service';

@ApiTags('productstore')
@Controller('productstore')
export class ProductStoreController {
  constructor(
    private readonly ProductStoreService: ProductStoreService,
    private readonly defaultMessagesService: DefaultMessagesService,
  ) {}

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar produtoLoja cadastrado por idProd' })
  @ApiParam({ name: 'id', description: 'ID do produto' })
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
