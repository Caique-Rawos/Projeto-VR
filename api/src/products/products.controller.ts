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
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { ProductsDto } from './dtos/products.dto';
import { ProductModel } from './product.model';

const INVALID_REQUEST_MSG: string = 'Requisicao Invalida';

@ApiTags('products') // Adiciona uma tag à documentação Swagger
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo produto' })
  @ApiBody({ type: ProductsDto })
  @ApiResponse({ status: 201, description: 'Produto criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Solicitacao Invalida' })
  async addProduct(@Body() productDto: ProductsDto): Promise<{ id: number }> {
    try {
      const generatedId = await this.productsService.insertProduct(
        new ProductModel(productDto.desc, productDto.price, ''),
      );
      return { id: generatedId };
    } catch (error) {
      throw new BadRequestException(INVALID_REQUEST_MSG, error.message);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Buscar todos os produtos cadastrados' })
  @ApiResponse({
    status: 200,
    description: 'Lista de produtos obtida com sucesso',
  })
  async getAllProducts(): Promise<ProductModel[]> {
    return this.productsService.getProducts();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar produto cadastrado por Id' })
  @ApiParam({ name: 'id', description: 'ID do produto' })
  @ApiResponse({ status: 200, description: 'Produto obtido com sucesso' })
  @ApiResponse({ status: 404, description: 'Produto nao encontrado' })
  async getProduct(@Param('id') prodId: number): Promise<ProductModel | null> {
    try {
      return await this.productsService.getSingleProduct(prodId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else {
        throw new BadRequestException(INVALID_REQUEST_MSG, error.message);
      }
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar produto cadastrado' })
  @ApiParam({ name: 'id', description: 'ID do produto' })
  @ApiBody({ type: ProductsDto })
  @ApiResponse({ status: 200, description: 'Produto atualizado com sucesso' })
  @ApiResponse({ status: 400, description: 'Solicitacao Invalida' })
  @HttpCode(HttpStatus.NO_CONTENT) // Define o código de status HTTP sem corpo de resposta
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
        throw new BadRequestException(INVALID_REQUEST_MSG, error.message);
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
      throw new BadRequestException(INVALID_REQUEST_MSG, error.message);
    }
  }
}
