import { Controller, Get, Post, Body,  Param, Delete, Put, Res, HttpStatus, NotFoundException, ValidationPipe,UsePipes, BadRequestException, Patch } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { Response } from 'express';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  findAll():Product[]{
    try {
      const serviceResponse: Product[] = this.productService.findAll();
      return serviceResponse;
    
    } catch (error) {
      throw new NotFoundException("Not found")
    }
  }


  @Get("/:id")
  findOne(@Param("id") id: string):Product {
    try {
      const serviceResponse: Product = this.productService.findOne(id);
      return serviceResponse;
    } catch (error) {
      throw new NotFoundException("Not found")
    }
  }


  @Post()
  // habilita la transformacion del objeto al tipo del DTO antes de usarlo en la logica.
  @UsePipes(new ValidationPipe({ transform: true }))

  create(@Body() createProductDto: CreateProductDto): Product {

    try {
      const serviceResponse: Product = this.productService.create(createProductDto)
      return serviceResponse;
    } catch (error) {
      throw new BadRequestException("Creation failed")
    }
  }


  @Patch(':id')
  // habilita la transformacion del objeto al tipo del DTO antes de usarlo en la logica.
  @UsePipes(new ValidationPipe({ transform: true }))

  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto): Product {

    try {
      const serviceResponse:Product = this.productService.update(id, updateProductDto);
      return serviceResponse;

    } catch (error) {
      throw new NotFoundException("Update failed")
    }
  }


  @Delete(":id")
  remove(@Param('id') id: string): Product{
    try {
      const serviceResponse:Product = this.productService.remove(id);
      return serviceResponse;

    } catch (error) {
      throw new NotFoundException("Delete failed")
    }
  }

}
