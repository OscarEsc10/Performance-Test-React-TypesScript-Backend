import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, ParseIntPipe } from '@nestjs/common';
import { ProductsService } from './product.service';
import * as createProductDto from './entities/dto/create-product.dto';
import * as updateProductDto from './entities/dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() dto: createProductDto.CreateProductDto) {
    return this.productsService.create(dto).then((product) => ({
      message: 'Product created successfully',
      data: product,
    }));
  }

  @Get()
  findAll(
    @Query('brand') brand?: string,
    @Query('category') category?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.productsService
      .findAll({ brand, category }, Number(page), Number(limit))
      .then((items) => ({ message: 'Products fetched successfully', data: items }));
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: updateProductDto.UpdateProductDto) {
    return this.productsService.update(id, dto).then((product) => ({
      message: 'Product updated successfully',
      data: product,
    }));
  }

  @Put(':id')
  replace(@Param('id', ParseIntPipe) id: number, @Body() dto: updateProductDto.UpdateProductDto) {
    return this.productsService.update(id, dto).then((product) => ({
      message: 'Product replaced successfully',
      data: product,
    }));
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id).then((product) => ({
      message: 'Product fetched successfully',
      data: product,
    }));
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id).then((product) => ({
      message: 'Product deleted successfully',
      data: product,
    }));
  }
}

