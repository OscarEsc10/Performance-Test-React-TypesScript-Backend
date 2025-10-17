import { Controller, Post, Request, UseGuards, Body, BadRequestException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

/**
 * This controller manages authentication actions.
 * It defines routes related to user authentication.
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

  /**
   * Register a new user (POST /auth/register)
   * Creates a new user account and returns a JWT token
   * 
   * @param registerDto - Contains username, email, and password
   * @returns User data and JWT token
   */
  @Post('register')
  async register(
    @Body() registerDto: { username: string; email: string; password: string },
  ) {
    try {
      // Validate required fields
      if (!registerDto.username || !registerDto.email || !registerDto.password) {
        throw new BadRequestException('All fields are required');
      }

      // Call the auth service to register the user
      const user = await this.authService.register(registerDto);
      
      // Log the user in immediately after registration
      return this.authService.login(user);
    } catch (error) {
      // Handle duplicate username/email errors
      if (error.code === '23505') {
        throw new BadRequestException('Username or email already exists');
      }
      throw error;
    }
  }
}
