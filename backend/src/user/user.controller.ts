import { Controller, Get, UseGuards } from '@nestjs/common';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from './user.entity';

@Controller('users')
export class UserController {
  
  @Get('admin')
  @Roles(UserRole.ADMIN) // 👈 Seul un ADMIN peut accéder à cette route
  @UseGuards(RolesGuard)
  getAdminData() {
    return { message: 'Données réservées aux admins' };
  }

  @Get('profile')
  @Roles(UserRole.USER) // 👈 Seuls les utilisateurs connectés peuvent accéder
  @UseGuards(RolesGuard)
  getUserProfile() {
    return { message: 'Données utilisateur' };
  }
}
