import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET, // put secret in .env
    });
  }

  /** Validate callback runs for every secured request */
  async validate(payload: any) {
    const user = await this.authService.findUserById(payload.sub);
    // whatever you return becomes `request.user`
    return user ? user : null;
  }
}
