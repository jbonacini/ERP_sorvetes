import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) { }

  async validateUser(email: string, pass: string): Promise<any> {
    const users = await this.usersService.findAll(); // TODO: Implement findByEmail in UsersService
    const user = users.find(u => u.email === email);

    if (user && (await bcrypt.compare(pass, user.senha))) {
      const { senha, ...result } = user;
      return result;
    }
    // Fallback for non-hashed passwords during migration (Optional)
    if (user && user.senha === pass) {
      const { senha, ...result } = user;
      return result;
    }

    return null;
  }

  async login(user: any) {
    const payload = {
      email: user.email,
      sub: user.id,
      empresaId: user.empresaId,
      cargo: user.cargo,
      perfilId: user.perfilId
    };
    return {
      access_token: this.jwtService.sign(payload),
      user
    };
  }
}
