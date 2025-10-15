import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  ParseIntPipe,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ProductsService } from './product.service';
import type { CreateProductDto } from './entities/dto/create-product.dto';
import type { UpdateProductDto } from './entities/dto/update-product.dto';

/**
 * Controller that manages all product routes.
 * Handles product creation, reading, updating, and soft deletion.
 */
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  /**
   * Create a new product.
   * @param dto - Product data from the request body.
   */
  @Post()
  async create(@Body() dto: CreateProductDto) {
    try {
      const product = await this.productsService.create(dto);
      return { message: 'Product created successfully', data: product };
    } catch (error) {
      if (error.message === 'SKU already exists') {
        throw new HttpException('SKU already exists', HttpStatus.CONFLICT);
      }
      throw new HttpException(
        error.message || 'Failed to create product',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Retrieve all products (with optional filters and pagination).
   * @query brand - Filter by brand.
   * @query category - Filter by category.
   * @query page - Pagination page (default: 1).
   * @query limit - Items per page (default: 20).
   */
  @Get()
  async findAll(
    @Query('brand') brand?: string,
    @Query('category') category?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    try {
      const products = await this.productsService.findAll(
        { brand, category },
        Number(page),
        Number(limit),
      );
      return { message: 'Products retrieved successfully', data: products };
    } catch (error) {
      throw new HttpException(
        'Failed to retrieve products',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Retrieve a single product by its ID.
   * @param id - Product ID.
   */
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const product = await this.productsService.findOne(id);
      return { message: 'Product retrieved successfully', data: product };
    } catch (error) {
      if (error.message === 'Product not found') {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        'Failed to retrieve product',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Partially update a product.
   * @param id - Product ID.
   * @param dto - Partial product data.
   */
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductDto,
  ) {
    try {
      const updatedProduct = await this.productsService.update(id, dto);
      return { message: 'Product updated successfully', data: updatedProduct };
    } catch (error) {
      if (error.message === 'Product not found') {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }
      if (error.message === 'SKU already exists') {
        throw new HttpException('SKU already exists', HttpStatus.CONFLICT);
      }
      throw new HttpException(
        error.message || 'Failed to update product',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Replace a product completely (similar to update).
   * @param id - Product ID.
   * @param dto - New product data.
   */
  @Put(':id')
  async replace(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductDto,
  ) {
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
      throw new HttpException(
        error.message || 'Failed to replace product',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Soft-delete a product (mark as inactive).
   * @param id - Product ID.
   */
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.productsService.remove(id);
      return { message: 'Product deleted successfully' };
    } catch (error) {
      if (error.message === 'Product not found') {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        'Failed to delete product',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
