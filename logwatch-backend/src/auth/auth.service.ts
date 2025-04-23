import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '@/users/user.schema'; // adjust path

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  /** Validate user credentials (called by a local strategy or manual login) */
  async validateUser(username: string, pass: string) {
    const user = await this.userModel.findOne({ username });
    if (user && (await user.comparePassword(pass))) {
      // never return the password hash
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  /** Issue JWT for a validated user */
  async login(user: any) {
    const payload = { sub: user._id.toString(), username: user.username };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  /** Helper for JwtStrategy: fetch user by ID */
  async findUserById(userId: string) {
    return this.userModel.findById(userId).lean();
  }
}
