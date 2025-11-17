import { JwtService } from '@nestjs/jwt';
import { User } from '../models/user.model';
export declare class AuthService {
    private userModel;
    private jwtService;
    constructor(userModel: typeof User, jwtService: JwtService);
    register(username: string, email: string, password: string): Promise<{
        token: string;
    }>;
    login(email: string, password: string): Promise<{
        token: string;
    }>;
    validateUser(userId: number): Promise<User>;
}
