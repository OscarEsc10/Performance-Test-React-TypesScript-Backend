import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

/**
 * Product entity
 * 
 * This class represents a product in the database.
 * It defines the table structure, data types, and column options.
 */
@Entity('products')
export class Product {
  /**
   * Unique ID for each product (auto-generated).
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Unique product code (SKU).
   * It has a unique index so two products cannot have the same SKU.
   */
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 100 })
  sku: string;

  /**
   * The name of the product.
   */
  @Column()
  name: string;

  /**
   * The brand or company that makes the product.
   */
  @Column()
  brand: string;

  /**
   * The number of items available in stock.
   * Default value is 0.
   */
  @Column({ type: 'int', default: 0 })
  quantity: number;

  /**
   * The price of the product.
   * Uses numeric type with two decimal places.
   */
  @Column({ type: 'numeric', precision: 10, scale: 2 })
  price: number;

  /**
   * Shows if the product is active (true) or soft-deleted (false).
   * Default is true.
   */
  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  /**
   * Optional category name (for example, "Electronics", "Shoes", etc.).
   */
  @Column({ nullable: true })
  category: string;

  /**
   * Optional image URL for the product picture.
   */
  @Column({ name: 'image_url', nullable: true })
  imageUrl: string;

  /**
   * The date and time when the product was created.
   * This field is filled automatically.
   */
  @CreateDateColumn({ name: 'create_at' })
  createdAt: Date;
}
