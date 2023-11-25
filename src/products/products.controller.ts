import {
  Controller,
  Body,
  Post,
  Get,
  Param,
  Put,
  Delete,
} from '@nestjs/common';

import { ProductsService } from './products.service';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { ProductsDto } from './dtos/products.dto';
import { ProductModel } from './product.model';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo produto' })
  @ApiBody({ type: ProductsDto })
  @ApiResponse({ status: 201, description: 'Produto criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Solicitação inválida' })
  addProduct(
    @Body('descricao') prodDesc: string,
    @Body('preco') prodPrice: number,
  ): any {
    const product = new ProductModel();
    product.ProductModel(prodDesc, prodPrice, '');
    const generatedId = this.productsService.insertProduct(product);
    return { id: generatedId };
  }

  @Get()
  @ApiOperation({ summary: 'Buscar todos os produto cadastrados' })
  getAllProducts() {
    return this.productsService.getProducts();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar produto cadastrado por Id' })
  @ApiParam({ name: 'id', description: 'ID do produto' })
  getProduct(@Param('id') prodId: number) {
    return this.productsService.getSingleProduct(prodId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar produto cadastrado' })
  @ApiParam({ name: 'id', description: 'ID do produto' })
  @ApiBody({ type: ProductsDto })
  updateProduct(
    @Param('id') prodId: number,
    @Body('descricao') prodDesc: string,
    @Body('preco') prodPrice: number,
  ) {
    this.productsService.updateProduct(prodId, prodDesc, prodPrice);
    return null;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar produto cadastrado por Id' })
  @ApiParam({ name: 'id', description: 'ID do produto' })
  deleteProduct(@Param('id') prodId: number) {
    this.productsService.deleteProduct(prodId);
    return null;
  }
}
