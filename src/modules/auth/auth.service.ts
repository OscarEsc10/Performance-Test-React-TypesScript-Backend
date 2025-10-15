import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "../users/user.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService, private jwtService: JwtService) { }

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOne(username);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        if (!user.isActive) {
            throw new UnauthorizedException('User is inactive');
        }
        const ok = await bcrypt.compare(pass, user.password);
        if (!ok) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const { password, ...result } = user as any;
        return result;
    }

    async login(user: any) {
        if (!user || !user.username) {
            throw new UnauthorizedException('Invalid user data');
        }
        const payload = { username: user.username, sub: user.id ?? user.userId, role: user.role };
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