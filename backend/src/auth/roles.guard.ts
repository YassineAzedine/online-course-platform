// src/auth/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '../user/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.get<UserRole>('role', context.getHandler());
    if (!requiredRole) {
      return true; // Aucun rôle requis, tout le monde peut accéder
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new ForbiddenException('Authorization token is missing');
    }

    const token = authHeader.split(' ')[1]; // "Bearer token"
    if (!token) {
      throw new ForbiddenException('Token is missing');
    }

    try {
      console.log('Token:', token); // Ajouter un log pour voir le token
      const decoded = this.jwtService.verify(token ,  {secret: process.env.JWT_SECRET_KEY});
      console.log('Decoded Token:', decoded); // Ajouter un log pour voir les informations du token
      
      if (decoded.role !== requiredRole) {
        throw new ForbiddenException('You do not have permission to access this resource');
      }
      return true; // L'utilisateur a le bon rôle
    } catch (error) {
      console.error('JWT Error:', error); // Ajouter un log pour les erreurs JWT
      throw new ForbiddenException('Invalid or expired token');
    }
  }
}
