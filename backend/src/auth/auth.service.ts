import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
        
       return user 
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
  
    // Ajouter des options de signature, comme l'expiration et le secret
    const access_token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET_KEY, // Utilisez une clé secrète depuis une variable d'environnement
      expiresIn: '1h', // Définir une expiration du token (1 heure par exemple)
    });
  
    return {
      access_token,
    };
  }
  

  async register(email: string, password: string) {
    return this.userService.createUser(email, password);
  }
}
