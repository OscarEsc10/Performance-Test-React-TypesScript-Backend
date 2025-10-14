import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddDefaults } from '../../common/decorators/add-defaults.decorators';
import { User } from './entitites/user.entity';
import { CreateUserDto } from './entitites/dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private usersRepo: Repository<User>) {}

  @AddDefaults({ role: 'user', createdAt: () => new Date() })
  async create(createUserDto: CreateUserDto) {
    if (typeof (createUserDto as any).createdAt === 'function') {
      (createUserDto as any).createdAt = (createUserDto as any).createdAt();
    }
    const user = this.usersRepo.create(createUserDto as any);
    return this.usersRepo.save(user);
  }

  async findOne(username: string) {
    return this.usersRepo.findOne({ where: { username } });
  }
}
