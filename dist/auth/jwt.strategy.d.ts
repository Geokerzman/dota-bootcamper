import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private configService;
    private authService;
    private readonly logger;
    constructor(configService: ConfigService, authService: AuthService);
    validate(payload: any): Promise<{
        id: number;
    }>;
}
export {};
