import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';

/**
 * This strategy is used for username and password login.
 * It runs before JWT authentication to check user credentials.
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    // Default expects fields: "username" and "password"
    super();
  }

  /**
   * Validate user credentials during login.
   * @param username - The username entered by the user.
   * @param password - The password entered by the user.
   * @returns The user data if credentials are correct.
   * @throws UnauthorizedException if credentials are invalid.
   */
  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }
}
