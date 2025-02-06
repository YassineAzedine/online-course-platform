import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { log } from 'console';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) return false;

    try {
      const token = authHeader.split(' ')[1];
      console.log('Decoded Token:', token);

      const decoded = this.jwtService.verify(token , {secret: process.env.JWT_SECRET_KEY},);
      request.user = decoded;
      
      return true;
    } catch (err) {
        console.error('JWT Error:', err);
      return false;
    }
  }
}
