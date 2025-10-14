import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddDefaults } from '../../common/decorators/add-defaults.decorators';
import { User } from './entitites/user.entity';
import { CreateUserDto } from './entitites/dto/create-user.dto';
import { UpdateUserDto } from './entitites/dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private usersRepo: Repository<User>) {}

  @AddDefaults({ role: 'user', createdAt: () => new Date() })
  async create(createUserDto: CreateUserDto) {
    if (typeof (createUserDto as any).createdAt === 'function') {
      (createUserDto as any).createdAt = (createUserDto as any).createdAt();
    }
    if (createUserDto.password) {
      createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
    }
    const user = this.usersRepo.create(createUserDto as any);
    return this.usersRepo.save(user);
  }

  async findOne(username: string) {
    return this.usersRepo.findOne({ where: { username } });
  }

  async findById(id: number) {
    return this.usersRepo.findOne({ where: { id } });
  }

  async list() {
    return this.usersRepo.find();
  }

  async findByName(username: string) {
    return this.usersRepo.find({ where: { username } });
  }

  async update(id: number, dto: UpdateUserDto) {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }
    Object.assign(user, dto);
    return this.usersRepo.save(user);
  }

  async remove(id: number) {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    await this.usersRepo.delete(id);
    return { deleted: true };
  }
}
