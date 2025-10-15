import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

/**
 * Data Transfer Object (DTO) for updating an existing user.
 *
 * This class defines the properties that can be modified when updating a user
 * and includes validation rules using the `class-validator` decorators.
 *
 * All fields are optional since users may only want to update one or a few
 * specific attributes.
 */
export class UpdateUserDto {
  /**
   * The new username for the user.
   *
   * - Optional field.
   * - Must be a string.
   */
  @IsOptional()
  @IsString()
  username?: string;

  /**
   * The new email address of the user.
   *
   * - Optional field.
   * - Must be a valid email format.
   */
  @IsOptional()
  @IsEmail()
  email?: string;

  /**
   * The new password for the user.
   *
   * - Optional field.
   * - Must be a string.
   * - Must have at least 6 characters.
   * - Will be hashed before saving to the database.
   */
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  /**
   * The user's role within the system.
   *
   * - Optional field.
   * - Must be a string that matches one of the allowed roles.
   *   (e.g., 'admin', 'user', etc., as defined in the `UserRole` enum)
   */
  @IsOptional()
  @IsString()
  role?: string;

  /**
   * Indicates whether the user account is active.
   *
   * - Optional field.
   * - Must be a boolean.
   * - When set to false, the user loses access to the system.
   */
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
