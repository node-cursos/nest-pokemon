import { IsPositive, IsInt, MinLength,IsString ,Min} from "class-validator";

export class CreatePokemonDto {
    @IsPositive()
    @IsInt()
    @Min(1)
    numberPokemon: number;

    @IsString()
    @MinLength(1)
    name: string;
}
