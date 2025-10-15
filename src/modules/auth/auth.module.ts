import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.modules';
import { LocalStrategy } from './local.straregy';
import { JwtStrategy } from './jwt.strategy';
import type { JwtModuleOptions } from '@nestjs/jwt';

/**
 * This module handles authentication for the app.
 * It connects all parts related to login, JWT, and user validation.
 */
@Module({
  imports: [
    // Import UsersModule to get access to user data and validation
    UsersModule,

    // PassportModule is used to manage authentication strategies (like local or JWT)
    PassportModule,

    // JwtModule is used to create and verify JSON Web Tokens (JWT)
    JwtModule.registerAsync({
      // Configure JWT options using environment variables
      useFactory: (): JwtModuleOptions => ({
        // Secret key for signing tokens
        secret: process.env.JWT_SECRET || 'dev_secret',
        // Token expiration time (default: 3600 seconds = 1 hour)
        signOptions: { expiresIn: Number(process.env.JWT_EXPIRES_IN || 3600) },
      }),
    }),
  ],

  // Providers: classes that contain the logic (services and strategies)
  providers: [AuthService, LocalStrategy, JwtStrategy],

  // Controllers: handle routes like /auth/login
  controllers: [AuthController],

  // Exports: make AuthService available to other modules
  exports: [AuthService],
})
export class AuthModule {}
