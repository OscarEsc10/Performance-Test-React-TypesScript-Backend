import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// This guard uses the 'jwt' strategy to protect routes.
// It checks for a valid JWT token in the request.
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
