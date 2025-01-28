import { Module } from '@nestjs/common';
import { PokemonModule } from './pokemon/pokemon.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { ConfigModule } from '@nestjs/config';
import { envConfiguration } from './config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [envConfiguration],
    }),
    PokemonModule,
    MongooseModule.forRoot(
      process.env.MONGODB_URL ?? 'mongodb://localhost:27017/nest-pokemon',
    ),
    CommonModule,
    SeedModule,
  ],
})
export class AppModule {}
