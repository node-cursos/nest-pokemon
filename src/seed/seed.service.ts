import { Injectable } from '@nestjs/common';
import  axios, {AxiosInstance} from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { PokemonService } from '../pokemon/pokemon.service';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';

@Injectable()
export class SeedService {

  private readonly axios:AxiosInstance = axios;
  constructor(private readonly pokemonService: PokemonService,@InjectModel(Pokemon.name) private pokemonModel: Model<Pokemon>){}
  

  

  async executeSeed() {
    const {data} = await this.axios.get<PokeResponse>(`https://pokeapi.co/api/v2/pokemon?limit=1000`);
    await this.pokemonModel.deleteMany();
    const inserts = data.results.map(poke =>{
      const segments = poke.url.split('/');
      const numberPoke = +segments[segments.length -2];
      return {
        name: poke.name,numberPokemon: numberPoke
      }
    });
    await this.pokemonModel.insertMany(inserts);


    //  data.results.forEach(async poke =>{
    //   const segments = poke.url.split('/');
    //   const numberPoke = +segments[segments.length -2];
    //   await this.pokemonService.create({
    //     name: poke.name,numberPokemon: numberPoke
    //   })
    //   // console.log(numberPoke);
      
    // })
    return data.results;
  }

  
}
