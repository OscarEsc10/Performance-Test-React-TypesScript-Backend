import { Injectable } from "@nestjs/common";
import { UsersService } from "../users/user.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService, private jwtService: JwtService) { }

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOne(username);
        if (!user) return null;
        const ok = await bcrypt.compare(pass, user.password);
        if (!ok) return null;
        const { password, ...result } = user as any;
        return result;
    }

    async login(user: any) {
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