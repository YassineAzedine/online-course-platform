import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { JwtModule } from '@nestjs/jwt'; // 👈 Ajoute ceci
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // 👈 Assure-toi de l'importation correcte

@Module({
  imports: [
    JwtModule.register({ // 👈 Ajoute ce module pour fournir JwtService
      secret: 'your_secret_key', // Remplace par une variable d’environnement
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [ProfileService, JwtAuthGuard],
  controllers: [ProfileController],
})
export class ProfileModule {}
