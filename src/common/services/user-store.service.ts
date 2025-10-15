import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../../modules/users/user.service';
import { CreateUserDto } from '../../modules/users/entitites/dto/create-user.dto';
import { UpdateUserDto } from '../../modules/users/entitites/dto/update-user.dto';

@Injectable()
export class UserStore {
  private readonly logger = new Logger(UserStore.name);

  constructor(private readonly usersService: UsersService) {}

  async list() {
    this.logger.log('Simulating GET /users');
    return this.usersService.list();
  }

  async findByName(username: string) {
    this.logger.log(`Simulating GET /users/search?username=${username}`);
    return this.usersService.findByName(username);
  }

  async create(dto: CreateUserDto) {
    this.logger.log('Simulating POST /users');
    return this.usersService.create(dto);
  }

  async update(id: number, dto: UpdateUserDto) {
    this.logger.log(`Simulating PATCH /users/${id}`);
    return this.usersService.update(id, dto);
  }

  async remove(id: number) {
    this.logger.log(`Simulating DELETE /users/${id}`);
    return this.usersService.remove(id);
  }
}
