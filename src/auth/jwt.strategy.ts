import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'your-secret-key',
    });
  }

  async validate(payload: any) {
    try {
      if (!payload || !payload.user || !payload.user.id) {
        this.logger.warn('Invalid JWT payload structure', payload);
        throw new UnauthorizedException('Invalid token payload');
      }

      const user = await this.authService.validateUser(payload.user.id);
      if (!user) {
        this.logger.warn(`User not found for ID: ${payload.user.id}`);
        throw new UnauthorizedException('User not found');
      }
      
      this.logger.debug(`JWT validated successfully for user ID: ${user.id}`);
      return { id: user.id };
    } catch (error) {
      this.logger.error(`JWT validation failed: ${error.message}`, error.stack);
      throw error instanceof UnauthorizedException 
        ? error 
        : new UnauthorizedException('Token validation failed');
    }
  }
}

