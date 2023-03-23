import { BadRequestException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PokemonService {

  constructor(@InjectModel(Pokemon.name) private pokemonModel: Model<Pokemon>
  , private readonly configService:ConfigService ) {
    // console.log(configService.get('defaultLimit'));
    

  }

  async create(createPokemonDto: CreatePokemonDto) {
    try {
      createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();
      const pokemon =  await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      this.handleExceptions(error);
      
    }
    
  }

  async findAll(pagination: PaginationDto) {
    const defaultLimit = this.configService.get<number>('defaultLimit');
    const {limit = defaultLimit, offset=0} = pagination;
    return await this.pokemonModel.find()
    .limit(limit)
    .skip(offset)

  }

  async findOne(term: string) {
    let pokemon: Pokemon;

    if(!isNaN(+term)){
      pokemon = await this.pokemonModel.findOne({numberPokemon: term});
    }
    // mongoID
    if(!pokemon && isValidObjectId(term)){
      pokemon = await this.pokemonModel.findById(term);
    }

    if(!pokemon){
      pokemon = await this.pokemonModel.findOne({name: term.toLocaleLowerCase().trim()});
    }

    if(!pokemon) throw  new NotFoundException(`Pokemon with id, name  or numberPokemon ${term} no found`)

    return pokemon;
    
   
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    try {
      const pokemon = await this.findOne(term);
      if(updatePokemonDto.name)  updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase();
      await pokemon.updateOne(updatePokemonDto,{new: true});
      return {...pokemon.toJSON(),...updatePokemonDto};

    } catch (error) {
      if(error.status === HttpStatus.NOT_FOUND) throw new NotFoundException(error.message);
      this.handleExceptions(error);
    }
  
  }

  async remove(id: string) {
    // const pokemon = await this.findOne(id);
    // await pokemon.deleteOne();
    const {deletedCount,acknowledged} = await this.pokemonModel.deleteOne({_id: id});
    if(deletedCount === 0) throw new NotFoundException(`Pokemon with id ${id} no found`);
  }

  private handleExceptions(error: any){
    if(error.code === 11000){
      throw new BadRequestException(`Pokemon exists in db ${JSON.stringify(error.keyValue)}`)
    }
    console.log(error);
    throw new InternalServerErrorException(`Can´t create pokemon - check server log`)
  }

 
}
