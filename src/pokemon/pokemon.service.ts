import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Model, isValidObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Pokemon } from './entities/pokemon.entity';
import { CreatePokemonDto, UpdatePokemonDto } from './dto';
import { PaginationDto } from 'src/common/dtos/Pagination.dto';

@Injectable()
export class PokemonService {
  private defaultLimit: number;
  private defaultOffset: number;

  constructor(
    @InjectModel(Pokemon.name) private readonly pokemonModel: Model<Pokemon>,
    private readonly configService: ConfigService,
  ) {
    this.defaultLimit = Number(
      this.configService.get<number>('PAGINATION_DEFAULT_LIMIT'),
    );
    this.defaultOffset = Number(
      this.configService.get<number>('PAGINATION_DEFAULT_OFFSET'),
    );
  }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();

    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      this.handlerException(error);
    }
  }

  findAll(paginationDto: PaginationDto) {
    const limit = paginationDto.limit ?? this.defaultLimit;
    const offset = paginationDto.offset ?? this.defaultOffset;

    return this.pokemonModel.find().limit(limit).skip(offset);
  }

  async findOne(term: string) {
    let pokemon: Pokemon;
    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({ no: term });
    }

    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term);
    }

    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({
        name: term.toLocaleLowerCase(),
      });
    }

    if (!pokemon)
      throw new NotFoundException(
        `Pokemon with id, name or no '${term}' not found.`,
      );

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term);

    if (updatePokemonDto.name)
      updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase();

    try {
      await pokemon.updateOne(updatePokemonDto, { new: true });
      return { ...pokemon.toJSON(), ...updatePokemonDto };
    } catch (error) {
      this.handlerException(error);
    }
  }

  async remove(_id: string) {
    /* const pokemon = await this.findOne(_id);
    await pokemon.deleteOne(); */

    const { deletedCount } = await this.pokemonModel.deleteOne({ _id });
    if (deletedCount === 0) {
      throw new BadRequestException(`Pokemon with id ${_id} not found!`);
    }
  }

  async removeAll() {
    const { deletedCount } = await this.pokemonModel.deleteMany({});

    return {
      deletedCount,
    };
  }

  async insertMany(data: { name: string; no: number }[]) {
    this.pokemonModel.insertMany(data);
  }

  private handlerException(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Pokemon '${JSON.stringify(error.keyValue)}' already exist.`,
      );
    }
    throw new InternalServerErrorException(`Can't create Pokemon - Check logs`);
  }
}
