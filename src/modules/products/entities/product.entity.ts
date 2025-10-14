import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 100 })
  sku: string;

  @Column()
  name: string;

  @Column()
  brand: string;

  @Column({ type: 'int', default: 0 })
  quantity: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  price: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ nullable: true })
  category: string;

  @Column({ name: 'image_url', nullable: true })
  imageUrl: string;

  @CreateDateColumn({ name: 'create_at' })
  createdAt: Date;
}
