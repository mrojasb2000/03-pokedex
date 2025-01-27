import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { PokemonService } from 'src/pokemon/pokemon.service';
import { CreatePokemonDto } from 'src/pokemon/dto';

@Injectable()
export class SeedService {
  constructor(private readonly pokemonService: PokemonService) {}

  private readonly axios: AxiosInstance = axios;

  async findAll() {
    await this.pokemonService.removeAll();

    const { data } = await this.axios.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=10',
    );

    const insertPromiseArray = [];

    data.results.forEach(({ name, url }) => {
      const segments = url.split('/');
      const no = Number(segments[segments.length - 2]);
      const createPokemonDto: CreatePokemonDto = {
        name,
        no,
      };
      console.log({ name, no });
      //this.pokemonService.create(createPokemonDto);
      insertPromiseArray.push(this.pokemonService.create(createPokemonDto));
    });

    // Insert records simultaneously
    await Promise.all(insertPromiseArray);

    return data.results;
  }
}
