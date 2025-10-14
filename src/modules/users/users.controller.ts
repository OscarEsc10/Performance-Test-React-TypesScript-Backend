import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './user.service';
import type { CreateUserDto } from './entitites/dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }
}

