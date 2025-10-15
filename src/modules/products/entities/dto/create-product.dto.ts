import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  IsOptional,
  Min,
} from 'class-validator';

/**
 * CreateProductDto
 *
 * This Data Transfer Object (DTO) defines the structure and rules
 * for creating a new product. It validates that the received data
 * is correct before saving it to the database.
 */
export class CreateProductDto {
  /**
   * Product SKU (unique code).
   * Must be a non-empty string.
   */
  @IsString()
  @IsNotEmpty()
  sku: string;

  /**
   * Product name.
   * Must be a non-empty string.
   */
  @IsString()
  @IsNotEmpty()
  name: string;

  /**
   * Brand name of the product.
   * Must be a non-empty string.
   */
  @IsString()
  @IsNotEmpty()
  brand?: string;

  /**
   * Product quantity in stock.
   * Must be a number greater than or equal to 0.
   */
  @IsNumber()
  @Min(0)
  quantity: number;

  /**
   * Product price.
   * Must be a number greater than or equal to 0.
   */
  @IsNumber()
  @Min(0)
  price: number;

  /**
   * Indicates if the product is active.
   * Optional field, must be a boolean if provided.
   */
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  /**
   * Product category (for example, "Electronics", "Clothing", etc.).
   * Optional field, must be a string if provided.
   */
  @IsString()
  @IsOptional()
  category?: string;

  /**
   * Product image URL.
   * Optional field, must be a string if provided.
   */
  @IsString()
  @IsOptional()
  imageUrl?: string;
}
