import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../../modules/users/user.service';
import { CreateUserDto } from '../../modules/users/entitites/dto/create-user.dto';
import { UpdateUserDto } from '../../modules/users/entitites/dto/update-user.dto';

/**
 * This class simulates a data store for users.
 * It calls the UsersService methods and adds logs for each action.
 * It helps to show how user operations would look in real HTTP requests.
 */
@Injectable()
export class UserStore {
  // Create a logger to show messages in the console
  private readonly logger = new Logger(UserStore.name);

  // Inject the UsersService to use its methods
  constructor(private readonly usersService: UsersService) {}

  /**
   * Simulate getting all users (GET /users)
   */
  async list() {
    this.logger.log('Simulating GET /users');
    return this.usersService.list();
  }

  /**
   * Simulate searching a user by username (GET /users/search?username=...)
   * @param username - The name of the user to find
   */
  async findByName(username: string) {
    this.logger.log(`Simulating GET /users/search?username=${username}`);
    return this.usersService.findByName(username);
  }

  /**
   * Simulate creating a new user (POST /users)
   * @param dto - The data to create the new user
   */
  async create(dto: CreateUserDto) {
    this.logger.log('Simulating POST /users');
    return this.usersService.create(dto);
  }

  /**
   * Simulate updating a user (PATCH /users/:id)
   * @param id - The ID of the user to update
   * @param dto - The new data for the user
   */
  async update(id: number, dto: UpdateUserDto) {
    this.logger.log(`Simulating PATCH /users/${id}`);
    return this.usersService.update(id, dto);
  }

  /**
   * Simulate deleting a user (DELETE /users/:id)
   * @param id - The ID of the user to remove
   */
  async remove(id: number) {
    this.logger.log(`Simulating DELETE /users/${id}`);
    return this.usersService.remove(id);
  }
}
