import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../common/enums/user-role.enum';

/**
 * This guard checks if a user has permission to access a route.
 * It uses the roles set by the @Roles() decorator.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  // The Reflector helps read metadata, like the roles from the @Roles decorator.
  constructor(private reflector: Reflector) {}

  /**
   * This method decides if the request can continue or not.
   * @param context - The current request and route information.
   * @returns true if the user has one of the required roles, false otherwise.
   */
  canActivate(context: ExecutionContext): boolean {
    // Get the roles that are required for this route
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      'roles',
      [context.getHandler(), context.getClass()],
    );

    // If no roles are required, allow access
    if (!requiredRoles) {
      return true;
    }

    // Get the user from the request
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // If no user is found, deny access
    if (!user) {
      return false;
    }
    

    // Check if the user's role matches one of the required roles
    return requiredRoles.some((role) => user.role?.includes(role));
  }
}
