import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddDefaults } from '../../common/decorators/add-defaults.decorators';
import { User } from './entitites/user.entity';
import { CreateUserDto } from './entitites/dto/create-user.dto';
import { UpdateUserDto } from './entitites/dto/update-user.dto';
import * as bcrypt from 'bcrypt';

/**
 * UsersService
 * -------------
 * This service handles all logic related to users.
 * It communicates with the database using TypeORM.
 *
 * Features:
 * - Create, read, update, delete users
 * - Activate / deactivate users
 * - Hash passwords with bcrypt
 */
@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private usersRepo: Repository<User>) {}

  /**
   * Create a new user.
   * - Adds default values (role and createdAt)
   * - Hashes the password before saving
   * @param createUserDto The data to create a user
   */
  @AddDefaults({ role: 'user', createdAt: () => new Date() })
  async create(createUserDto: CreateUserDto) {
    // Apply default "createdAt" if it's a function
    if (typeof (createUserDto as any).createdAt === 'function') {
      (createUserDto as any).createdAt = (createUserDto as any).createdAt();
    }

    // Encrypt password before saving
    if (createUserDto.password) {
      createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
    }

    // Create and save the new user
    const user = this.usersRepo.create(createUserDto as any);
    return this.usersRepo.save(user);
  }

  /**
   * Find one user by username.
   * Used for login or validation.
   * @param username The username to search
   */
  async findOne(username: string) {
    return this.usersRepo.findOne({ where: { username } });
  }

  /**
   * Find a user by their ID.
   * Throws an error if not found.
   * @param id The user ID
   */
  async findById(id: number) {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  /**
   * Get a list of all users.
   * @returns All users in the database
   */
  async list() {
    return this.usersRepo.find();
  }

  /**
   * Find users by username.
   * Can return multiple users with the same name.
   * @param username The name to search
   */
  async findByName(username: string) {
    return this.usersRepo.find({ where: { username } });
  }

  /**
   * Update user data.
   * - Finds user by ID
   * - Re-hashes password if it’s updated
   * @param id The user ID
   * @param dto New user data
   */
  async update(id: number, dto: UpdateUserDto) {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    // Encrypt new password if provided
    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }

    // Merge old and new data
    Object.assign(user, dto);
    return this.usersRepo.save(user);
  }

  /**
   * Delete a user permanently.
   * Throws an error if the user doesn’t exist.
   * @param id The user ID
   */
  async remove(id: number) {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    await this.usersRepo.delete(id);
    return { deleted: true };
  }

  /**
   * Activate a user (set isActive = true).
   * @param id The user ID
   */
  async activate(id: number) {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    user.isActive = true;
    return this.usersRepo.save(user);
  }

  /**
   * Deactivate a user (set isActive = false).
   * @param id The user ID
   */
  async deactivate(id: number) {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    user.isActive = false;
    return this.usersRepo.save(user);
  }
}
