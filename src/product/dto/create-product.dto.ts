import { Expose } from 'class-transformer';
import {IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from 'class-validator';


export class CreateProductDto {
    @Expose()
    @IsNotEmpty()
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    name: string;
    
    @Expose()
    @IsNotEmpty()
    @IsString()
    @MinLength(4)
    @MaxLength(255)
    description: string;

    @Expose()
    @IsNotEmpty()
    @IsNumber()
    price: number;
}


