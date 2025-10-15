import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, ParseIntPipe, HttpException, HttpStatus } from '@nestjs/common';
import { ProductsService } from './product.service';
import * as createProductDto from './entities/dto/create-product.dto';
import * as updateProductDto from './entities/dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(@Body() dto: createProductDto.CreateProductDto) {
    try {
      const product = await this.productsService.create(dto);
      return { message: 'Product created successfully', data: product };
    } catch (error) {
      if (error.message === 'SKU already exists') {
        throw new HttpException('SKU already exists', HttpStatus.CONFLICT);
      }
      throw new HttpException(error.message || 'Failed to create product', HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async findAll(
    @Query('brand') brand?: string,
    @Query('category') category?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    try {
      const items = await this.productsService.findAll({ brand, category }, Number(page), Number(limit));
      return { message: 'Products retrieved successfully', data: items };
    } catch (error) {
      throw new HttpException('Failed to retrieve products', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const product = await this.productsService.findOne(id);
      return { message: 'Product retrieved successfully', data: product };
    } catch (error) {
      if (error.message === 'Product not found') {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }
      throw new HttpException('Failed to retrieve product', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: updateProductDto.UpdateProductDto) {
    try {
      const product = await this.productsService.update(id, dto);
      return { message: 'Product updated successfully', data: product };
    } catch (error) {
      if (error.message === 'Product not found') {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }
      if (error.message === 'SKU already exists') {
        throw new HttpException('SKU already exists', HttpStatus.CONFLICT);
      }
      throw new HttpException(error.message || 'Failed to update product', HttpStatus.BAD_REQUEST);
    }
  }

  @Put(':id')
  async replace(@Param('id', ParseIntPipe) id: number, @Body() dto: updateProductDto.UpdateProductDto) {
    try {
      const product = await this.productsService.update(id, dto);
      return { message: 'Product replaced successfully', data: product };
    } catch (error) {
      if (error.message === 'Product not found') {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }
      if (error.message === 'SKU already exists') {
        throw new HttpException('SKU already exists', HttpStatus.CONFLICT);
      }
      throw new HttpException(error.message || 'Failed to replace product', HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.productsService.remove(id);
      return { message: 'Product deleted successfully' };
    } catch (error) {
      if (error.message === 'Product not found') {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }
      throw new HttpException('Failed to delete product', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

