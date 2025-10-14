import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ProductsService } from './product.service';
import type { CreateProductDto } from './entities/dto/create-product.dto';
import type { UpdateProductDto } from './entities/dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Get()
  findAll(
    @Query('brand') brand?: string,
    @Query('category') category?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.productsService.findAll({ brand, category }, Number(page), Number(limit));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.update(Number(id), dto);
  }
}

