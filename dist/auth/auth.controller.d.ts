import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(body: {
        username: string;
        email: string;
        password: string;
    }): Promise<{
        token: string;
    }>;
    login(body: {
        email: string;
        password: string;
    }): Promise<{
        token: string;
    }>;
    verifyToken(user: any): Promise<{
        valid: boolean;
        userId: any;
    }>;
}
