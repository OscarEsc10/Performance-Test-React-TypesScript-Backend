import { CreateProductDto } from './create-product.dto';

// DTO for updating a product.
// All fields are optional and can be partially provided.
export type UpdateProductDto = Partial<CreateProductDto> & {
  sku?: string;
};
