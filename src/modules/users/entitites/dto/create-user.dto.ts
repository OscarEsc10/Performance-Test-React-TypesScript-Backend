import { IsString, IsEmail, IsNotEmpty, MinLength } from 'class-validator';

/**
 * Data Transfer Object (DTO) for creating a new user.
 *
 * This class defines the information needed to register a new user
 * and uses validation rules from `class-validator` to make sure
 * the data is correct before saving it to the database.
 */
export class CreateUserDto {
  /**
   * The username of the new user.
   *
   * - Must be a string.
   * - Cannot be empty.
   * - Must be unique in the database.
   */
  @IsString()
  @IsNotEmpty()
  username: string;

  /**
   * The email of the new user.
   *
   * - Must be a valid email format.
   * - Cannot be empty.
   * - Must be unique in the database.
   */
  @IsEmail()
  @IsNotEmpty()
  email: string;

  /**
   * The password of the new user.
   *
   * - Must be a string.
   * - Cannot be empty.
   * - Must have at least 6 characters.
   * - Will be encrypted before saving.
   */
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;
}
