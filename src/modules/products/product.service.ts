import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './entities/dto/create-product.dto';
import { UpdateProductDto } from './entities/dto/update-product.dto';

/**
 * Service that manages all product operations.
 * Handles create, read, update, and soft-delete actions.
 */
@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly repo: Repository<Product>,
  ) {}

  /**
   * Create a new product.
   * @param dto - Data to create the product.
   * @throws ConflictException if SKU already exists.
   */
  async create(dto: CreateProductDto) {
    // Check if SKU already exists
    const exists = await this.repo.findOne({ where: { sku: dto.sku } });
    if (exists) {
      throw new ConflictException('SKU already exists');
    }

    const product = this.repo.create(dto);
    return await this.repo.save(product);
  }

  /**
   * Find all active products with optional filters.
   * @param filter - Optional filters by brand and category.
   * @param page - Page number for pagination (default: 1).
   * @param limit - Number of results per page (default: 20).
   */
  async findAll(
    filter: { brand?: string; category?: string },
    page = 1,
    limit = 20,
  ) {
    const qb = this.repo.createQueryBuilder('p');

    // Show only active products
    qb.andWhere('p.isActive = :active', { active: true });

    if (filter.brand) {
      qb.andWhere('p.brand = :brand', { brand: filter.brand });
    }
    if (filter.category) {
      qb.andWhere('p.category = :category', { category: filter.category });
    }

    qb.skip((page - 1) * limit).take(limit);
    return await qb.getMany();
  }

  /**
   * Find one product by ID.
   * @param id - Product ID.
   * @throws NotFoundException if the product does not exist.
   */
  async findOne(id: number) {
    const product = await this.repo.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  /**
   * Update product information.
   * @param id - Product ID.
   * @param dto - Data to update.
   * @throws NotFoundException if product not found.
   * @throws ConflictException if SKU already exists.
   */
  async update(id: number, dto: UpdateProductDto) {
    const product = await this.repo.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Check for duplicate SKU
    if (dto.sku && dto.sku !== product.sku) {
      const skuExists = await this.repo.findOne({ where: { sku: dto.sku } });
      if (skuExists) {
        throw new ConflictException('SKU already exists');
      }
    }

    Object.assign(product, dto);
    return await this.repo.save(product);
  }

  /**
   * Soft delete (deactivate) a product.
   * @param id - Product ID.
   * @throws NotFoundException if product not found.
   */
  async remove(id: number) {
    const product = await this.repo.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Soft delete: mark as inactive instead of deleting
    product.isActive = false;
    return await this.repo.save(product);
  }
}
