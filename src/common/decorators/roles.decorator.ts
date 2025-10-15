import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../enums/user-role.enum';

/**
 * This decorator is used to set roles for a route or method.
 * It saves the roles as metadata, so they can be checked later
 * (for example, by a guard that controls access).
 *
 * Example:
 * @Roles(UserRole.Admin)
 * getAllUsers() {
 *   // Only users with the 'Admin' role can access this
 * }
 */
export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
