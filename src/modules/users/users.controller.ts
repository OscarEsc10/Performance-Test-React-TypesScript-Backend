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
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './user.service';
import { CreateUserDto } from './entitites/dto/create-user.dto';
import { UpdateUserDto } from './entitites/dto/update-user.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';

/**
 * UsersController
 * ----------------
 * This controller manages all user operations:
 * - Create users
 * - Get all or specific users
 * - Search users by name
 * - Update, replace, delete
 * - Activate or deactivate users
 *
 * Routes are protected with Role Guards for admin actions.
 */
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * POST /users
   * Create a new user (admin only).
   * @param dto User data for creation (CreateUserDto)
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async create(@Body() dto: CreateUserDto) {
    try {
      const user = await this.usersService.create(dto);
      return { message: 'User created successfully', data: user };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to create user',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * GET /users
   * Get a list of all users (admin only).
   */
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async list() {
    try {
      const users = await this.usersService.list();
      return { message: 'Users retrieved successfully', data: users };
    } catch (error) {
      throw new HttpException(
        'Failed to retrieve users',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * GET /users/search?username=
   * Search users by their username.
   * @param username The username to search for
   */
  @Get('search')
  async findByName(@Query('username') username: string) {
    try {
      const users = await this.usersService.findByName(username);
      if (!users || users.length === 0) {
        throw new HttpException(
          'No users found with the given username',
          HttpStatus.NOT_FOUND,
        );
      }
      return { message: 'Users found successfully', data: users };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Failed to search users',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * GET /users/:id
   * Get user details by ID.
   * @param id User ID
   */
  @Get(':id')
  async findById(@Param('id') id: string) {
    try {
      const user = await this.usersService.findById(Number(id));
      return { message: 'User retrieved successfully', data: user };
    } catch (error) {
      if (error.message === 'User not found') {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        'Failed to retrieve user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * PATCH /users/:id
   * Update part of a user's data.
   * @param id User ID
   * @param dto Updated user data
   */
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    try {
      const user = await this.usersService.update(Number(id), dto);
      return { message: 'User updated successfully', data: user };
    } catch (error) {
      if (error.message === 'User not found') {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        error.message || 'Failed to update user',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * PUT /users/:id
   * Replace all user information.
   * @param id User ID
   * @param dto Full new user data
   */
  @Put(':id')
  async replace(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    try {
      const user = await this.usersService.update(Number(id), dto);
      return { message: 'User replaced successfully', data: user };
    } catch (error) {
      if (error.message === 'User not found') {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        error.message || 'Failed to replace user',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * DELETE /users/:id
   * Delete a user (only admins can do this).
   * @param id User ID
   */
  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async remove(@Param('id') id: string) {
    try {
      await this.usersService.remove(Number(id));
      return { message: 'User deleted successfully' };
    } catch (error) {
      if (error.message === 'User not found') {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        'Failed to delete user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * PATCH /users/:id/activate
   * Activate a user (admin only).
   * @param id User ID
   */
  @Patch(':id/activate')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async activate(@Param('id') id: string) {
    try {
      await this.usersService.activate(Number(id));
      return { message: 'User activated successfully' };
    } catch (error) {
      if (error.message === 'User not found') {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        'Failed to activate user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * PATCH /users/:id/deactivate
   * Deactivate a user (admin only).
   * @param id User ID
   */
  @Patch(':id/deactivate')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async deactivate(@Param('id') id: string) {
    try {
      await this.usersService.deactivate(Number(id));
      return { message: 'User deactivated successfully' };
    } catch (error) {
      if (error.message === 'User not found') {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        'Failed to deactivate user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
