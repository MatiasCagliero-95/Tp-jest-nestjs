import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class ProductService {


  private readonly products: Product[] = [{ id: "1", name: "Product 1", description: "Description 1", price: 100 }];

  findAll(): Promise<Product[]> {
    return new Promise((resolve) => {
        resolve(this.products);
    });

  }


  async findOne(id: string): Promise<Product> {
    const product = this.products.find((p) => p.id === id);
  
    if (!product) {
      throw new Error(`Not found`);
    }
  
    return product;
  }
  
  async create(createProductDto: CreateProductDto): Promise<Product> {
    return new Promise((resolve, reject) => {
      if (Object.keys(createProductDto).length === 0) {
        reject(new Error("Creation failed"));
        return;
      }
  
      const newProduct: Product = {
        ...createProductDto,
        id: Math.random().toString(36).substring(7),
      };
  
      this.products.push(newProduct);
      resolve(newProduct);
    });
  }
  

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    return new Promise((resolve, reject) => {
      
        const index = this.products.findIndex((p) => p.id === id);
        if (index === -1) {
          reject(new Error(`Not found`));
        }

        const updatedProduct:Product = { ...this.products[index], ...updateProductDto, id: id };

        this.products[index] = updatedProduct;

        resolve(updatedProduct);
    });
  }

  async remove(id: string): Promise<Product> {
    return new Promise((resolve, reject) => {
      
        const index = this.products.findIndex((p) => p.id === id);
        if (index === -1) {
         reject (new Error(`Not found`));
        }
  
        const deletedProduct = this.products[index];
        this.products.splice(index, 1);
  
        resolve(deletedProduct);
    });
  }

}

