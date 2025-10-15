import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

/**
 * This controller manages authentication actions.
 * It defines routes related to user login.
 */
@Controller('auth')
export class AuthController {
  // Inject the AuthService to handle authentication logic
  constructor(private readonly authService: AuthService) {}

  /**
   * Login route (POST /auth/login)
   * This route uses the 'local' strategy from Passport for authentication.
   * If the user is valid, it returns a JWT token.
   *
   * @param req - The request that contains the authenticated user.
   * @returns A JWT access token from AuthService.
   */
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req: any) {
    return this.authService.login(req.user);
  }
}
