import { Controller, Get, Post, Body,  Param, Delete, Put, Res, HttpStatus, NotFoundException, ValidationPipe,UsePipes, BadRequestException, Patch } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { Response } from 'express';
import { HttpException } from '@nestjs/common';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async findAll(): Promise<Product[]> {
    try {
      const serviceResponse: Product[] = await this.productService.findAll();
      return serviceResponse;
    } catch (error) {
      throw new HttpException("Not found", HttpStatus.NOT_FOUND);
    }
  }
  

  @Get("/:id")
  async findOne(@Param("id") id: string): Promise<Product> {
    try {
      const serviceResponse: Product = await this.productService.findOne(id);
      return serviceResponse;
    } catch (error) {
      throw new HttpException("Not found", HttpStatus.NOT_FOUND);
    }
  }


  @Post()
  // habilita la transformacion del objeto al tipo del DTO antes de usarlo en la logica.
  @UsePipes(new ValidationPipe({ transform: true }))

  async create(@Body() createProductDto: CreateProductDto): Promise<any> {
    try {
      // Lógica para crear el producto
      const serviceResponse = await this.productService.create(createProductDto);
      return serviceResponse;
    } catch (error) {
      // Manejar la excepción BadRequestException con mensajes específicos
      if (error instanceof BadRequestException) {
          throw new BadRequestException('Invalid data')
      }
    }
  }


  @Patch(':id')
  // habilita la transformacion del objeto al tipo del DTO antes de usarlo en la logica.
  @UsePipes(new ValidationPipe({ transform: true }))

  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto): Promise<Product> {

    try {
      const serviceResponse:Product = await this.productService.update(id, updateProductDto);
      return serviceResponse;

    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException('Invalid data')
    }
      throw new NotFoundException("Update failed")
    }
  }


  @Delete(":id")
  async remove(@Param('id') id: string): Promise<Product>{
    try {
      const serviceResponse:Product = await this.productService.remove(id);
      return serviceResponse;

    } catch (error) {
      throw new NotFoundException("Delete failed")
    }
  }

}
