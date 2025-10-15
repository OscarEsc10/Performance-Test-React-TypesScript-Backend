import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { UsersService } from './user.service';
import { CreateUserDto } from './entitites/dto/create-user.dto';
import { UpdateUserDto } from './entitites/dto/update-user.dto';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() dto: CreateUserDto) {
    try {
      const user = await this.usersService.create(dto);
      return { message: 'User created successfully', data: user };
    } catch (error) {
      throw new HttpException(error.message || 'Failed to create user', HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async list() {
    try {
      const users = await this.usersService.list();
      return { message: 'Users retrieved successfully', data: users };
    } catch (error) {
      throw new HttpException('Failed to retrieve users', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('search')
  async findByName(@Query('username') username: string) {
    try {
      const users = await this.usersService.findByName(username);
      if (!users || users.length === 0) {
        throw new HttpException('No users found with the given username', HttpStatus.NOT_FOUND);
      }
      return { message: 'Users found successfully', data: users };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Failed to search users', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    try {
      const user = await this.usersService.findById(Number(id));
      return { message: 'User retrieved successfully', data: user };
    } catch (error) {
      if (error.message === 'User not found') {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      throw new HttpException('Failed to retrieve user', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    try {
      const user = await this.usersService.update(Number(id), dto);
      return { message: 'User updated successfully', data: user };
    } catch (error) {
      if (error.message === 'User not found') {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      throw new HttpException(error.message || 'Failed to update user', HttpStatus.BAD_REQUEST);
    }
  }

  @Put(':id')
  async replace(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    try {
      const user = await this.usersService.update(Number(id), dto);
      return { message: 'User replaced successfully', data: user };
    } catch (error) {
      if (error.message === 'User not found') {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      throw new HttpException(error.message || 'Failed to replace user', HttpStatus.BAD_REQUEST);
    }
  }

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
      throw new HttpException('Failed to delete user', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

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
      throw new HttpException('Failed to activate user', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

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
      throw new HttpException('Failed to deactivate user', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

