import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "../users/user.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcrypt';

/**
 * This service handles the main authentication logic.
 * It validates users, checks their passwords, and creates JWT tokens.
 */
@Injectable()
export class AuthService {
    // Inject UsersService to get user data and JwtService to create tokens
    constructor(private usersService: UsersService, private jwtService: JwtService) { }

    /**
     * Validate a user's credentials.
     * @param username - The username entered by the user.
     * @param pass - The password entered by the user.
     * @returns The user data without the password if valid.
     * @throws UnauthorizedException if the credentials are invalid or the user is inactive.
     */
    async validateUser(username: string, pass: string): Promise<any> {
        // Find user by username
        const user = await this.usersService.findOne(username);

        // If user does not exist, throw an error
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Check if the user is active
        if (!user.isActive) {
            throw new UnauthorizedException('User is inactive');
        }

        // Compare entered password with the hashed password
        const ok = await bcrypt.compare(pass, user.password);
        if (!ok) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Remove password before returning the user
        const { password, ...result } = user as any;
        return result;
    }

    /**
     * Create a JWT token for a valid user.
     * @param user - The user data (must include username and id).
     * @returns An object with the access token and basic user info.
     */
    async login(user: any) {
        // Validate that user data exists
        if (!user || !user.username) {
            throw new UnauthorizedException('Invalid user data');
        }

        // Create the token payload
        const payload = { 
            username: user.username, 
            sub: user.id ?? user.userId, 
            role: user.role 
        };

        // Return the token and basic user info
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                username: user.username,
                role: user.role,
                userId: user.id ?? user.userId,
            }
        };
    }
}
