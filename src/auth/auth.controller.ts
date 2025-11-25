import { Body, Controller, Headers, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() { fullName, password }: LoginDto) {
    return this.authService.login(fullName, password);
  }

  @Post('logout')
  logout(
    @Headers('authorization') authorization?: string,
    @Body('token') tokenFromBody?: string,
  ) {
    const token = this.extractBearerToken(authorization) ?? tokenFromBody;
    return this.authService.logout(token);
  }

  private extractBearerToken(header?: string): string | undefined {
    if (!header) {
      return undefined;
    }
    const [scheme, value] = header.split(' ');
    if (scheme?.toLowerCase() !== 'bearer') {
      return undefined;
    }
    return value;
  }
}
