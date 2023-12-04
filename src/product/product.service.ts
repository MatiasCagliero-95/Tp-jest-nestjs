import { Injectable} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService {


  private readonly products: Product[] = [];

  findAll():Product[] {
    return this.products;
  }


  findOne(id: string): Product {
    const product = this.products.find((p) => p.id === id);
    if (!product) {
      throw new Error("Not found");
    }
    return product;
  }



  create(createProductDto: CreateProductDto): Product {
    try {
      const newProduct: Product = {
        ...createProductDto,
        // crea un id aleatoria:
        id: Math.random().toString(36).substring(7),
      };
      this.products.push(newProduct);
      return newProduct;
    } catch (error) {
      throw new Error("Created failed");
    }
  }


  update(id: string, updateProductDto: UpdateProductDto): Product {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error(`Product with ID ${id} not found`);
    }
    // sobreescribe lo anterior en caso de que se repita:
    const updatedProduct = { ...this.products[index], ...updateProductDto };

    this.products[index] = updatedProduct;

    return updatedProduct;
  }


  remove(id: string): Product {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error(`Product with ID ${id} not found`);
    }

    const deletedProduct = this.products[index];
    this.products.splice(index, 1);

    return deletedProduct;
  }
}

