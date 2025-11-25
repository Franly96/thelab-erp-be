import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { generateSessionToken } from '../users/password.util';
import { PublicUser } from '../users/user.model';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  private readonly sessions = new Map<string, number>();

  constructor(private readonly usersService: UsersService) {}

  async login(
    fullname: string,
    password: string,
  ): Promise<{ token: string; user: PublicUser }> {
    const user = await this.usersService.validateCredentials(
      fullname,
      password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const token = generateSessionToken();
    this.sessions.set(token, user.id);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...safeUser } = user;
    return { token, user: safeUser };
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async logout(token?: string): Promise<{ success: boolean }> {
    if (!token) {
      throw new BadRequestException('Token is required to logout');
    }
    const success = this.sessions.delete(token);
    return { success };
  }

  async resolveUser(token?: string): Promise<PublicUser | null> {
    if (!token) {
      return null;
    }
    const userId = this.sessions.get(token);
    if (!userId) {
      return null;
    }
    const user = await this.usersService.findById(userId);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }
}
