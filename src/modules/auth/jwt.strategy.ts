import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

/**
 * This strategy checks if a JWT token is valid.
 * It is used to protect routes that need authentication.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    // Configure how JWT tokens are read and verified
    super({
      // Get the token from the "Authorization" header (Bearer token)
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      // Do not ignore token expiration
      ignoreExpiration: false,

      // Secret key used to verify the token (from environment or default)
      secretOrKey: process.env.JWT_SECRET || 'dev_secret',
    });
  }

  /**
   * Validate the decoded token (payload).
   * This method is called automatically if the token is valid.
   * @param payload - The data inside the JWT token.
   * @returns Basic user information (userId, username, role).
   */
  async validate(payload: any) {
    return { 
      userId: payload.sub, 
      username: payload.username, 
      role: payload.role 
    };
  }
}
