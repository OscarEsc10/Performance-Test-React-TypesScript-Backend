import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entitites/user.entity';
import { UsersService } from './user.service';
import { UsersController } from './users.controller';
import { RolesGuard } from '../../common/guards/roles.guard';
import { UserStore } from '../../common/services/user-store.service';

// Module that encapsulates user management functionality.
// It includes services and controllers related to users.
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, RolesGuard, UserStore],
  exports: [UsersService, UserStore],
})
export class UsersModule {}

