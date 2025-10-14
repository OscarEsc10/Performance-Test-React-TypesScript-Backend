import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './entities/dto/create-product.dto';
import { UpdateProductDto } from './entities/dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(@InjectRepository(Product) private repo: Repository<Product>) {}

  async create(dto: CreateProductDto) {
    // check SKU uniqueness
    const exists = await this.repo.findOne({ where: { sku: dto.sku } });
    if (exists) throw new ConflictException('SKU already exists');
    const product = this.repo.create(dto);
    return await this.repo.save(product);
  }

  async findAll(
    filter: { brand?: string; category?: string },
    page = 1,
    limit = 20,
  ) {
    const qb = this.repo.createQueryBuilder('p');
    qb.andWhere('p.is_active = :active', { active: true });
    if (filter.brand) qb.andWhere('p.brand = :brand', { brand: filter.brand });
    if (filter.category)
      qb.andWhere('p.category = :category', { category: filter.category });
    qb.skip((page - 1) * limit).take(limit);
    return qb.getMany();
  }

  async findOne(id: number) {
    const product = await this.repo.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(id: number, dto: UpdateProductDto) {
    const product = await this.repo.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    if (dto.sku && dto.sku !== product.sku) {
      const skuExists = await this.repo.findOne({ where: { sku: dto.sku } });
      if (skuExists) throw new ConflictException('SKU already exists');
    }
    Object.assign(product, dto);
    return this.repo.save(product);
  }

  async remove(id: number) {
    // choose soft-delete:
    const product = await this.repo.findOne({ where: { id } });
    if (!product) throw new NotFoundException();
    product.isActive = false;
    return this.repo.save(product);
  }
}
