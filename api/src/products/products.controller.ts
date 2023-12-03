import {
  Controller,
  Body,
  Post,
  Get,
  Param,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
  BadRequestException,
  NotFoundException,
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { ProductsDto } from './dtos/products.dto';
import { ProductModel } from './product.model';
import { DefaultMessagesService } from '../default-messages/default-messages.service';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly defaultMessagesService: DefaultMessagesService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo produto' })
  @ApiBody({ type: ProductsDto })
  @ApiResponse({ status: 201, description: 'Produto criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Solicitacao Invalida' })
  async addProduct(@Body() productDto: ProductsDto): Promise<{ id: number }> {
    try {
      const generatedId = await this.productsService.insertProduct(
        new ProductModel(productDto.desc, productDto.price, productDto.image),
      );
      return { id: generatedId };
    } catch (error) {
      throw new BadRequestException(
        this.defaultMessagesService.INVALID_REQUEST_MSG,
        error.message,
      );
    }
  }

  @Get('all')
  @ApiOperation({ summary: 'Buscar todos os produtos cadastrados' })
  @ApiResponse({
    status: 200,
    description: 'Lista de produtos obtida com sucesso',
  })
  async getAllProducts(): Promise<ProductModel[]> {
    return this.productsService.getProducts();
  }

  @Get('byid')
  @ApiOperation({ summary: 'Buscar produto cadastrado por Id' })
  @ApiQuery({ name: 'id', required: false, description: 'ID do produto' })
  @ApiResponse({ status: 200, description: 'Produto obtido com sucesso' })
  @ApiResponse({ status: 404, description: 'Produto nao encontrado' })
  async getProduct(@Query('id') prodId: number): Promise<ProductModel | null> {
    try {
      return await this.productsService.getSingleProduct(prodId);
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

  @Get()
  @ApiOperation({ summary: 'Obter produtos com filtros' })
  @ApiQuery({ name: 'id', required: false, description: 'ID do produto' })
  @ApiQuery({ name: 'desc', required: false, description: 'Descrição' })
  @ApiQuery({ name: 'price', required: false, description: 'Preço de Custo' })
  @ApiQuery({ name: 'sell', required: false, description: 'Preço de venda' })
  async getProducts(
    @Query('id') id: number,
    @Query('desc') desc: string,
    @Query('price') price: string,
    @Query('sell') sell: string,
  ) {
    return this.productsService.getProductsDataTable(id, desc, price, sell);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar produto cadastrado' })
  @ApiParam({ name: 'id', description: 'ID do produto' })
  @ApiBody({ type: ProductsDto })
  @ApiResponse({ status: 200, description: 'Produto atualizado com sucesso' })
  @ApiResponse({ status: 400, description: 'Solicitacao Invalida' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateProduct(
    @Param('id') prodId: number,
    @Body() productDto: ProductsDto,
  ): Promise<void> {
    try {
      await this.productsService.updateProduct(
        prodId,
        productDto.desc,
        productDto.price,
      );
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

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar produto cadastrado por Id' })
  @ApiParam({ name: 'id', description: 'ID do produto' })
  @ApiResponse({ status: 200, description: 'Produto deletado com sucesso' })
  @ApiResponse({ status: 400, description: 'Solicitação Inválida' })
  async deleteProduct(@Param('id') prodId: number): Promise<void> {
    try {
      await this.productsService.deleteProduct(prodId);
    } catch (error) {
      throw new BadRequestException(
        this.defaultMessagesService.INVALID_REQUEST_MSG,
        error.message,
      );
    }
  }
}
