import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { HttpException } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import { rejects } from 'assert';

describe('ProductController', () => {
  let controller: ProductController;
  let service: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [ProductService],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

// --------------------FIND ALL-----------------------
describe('findAll', () => {
  it('should be defined', () => {
    expect(controller.findAll).toBeDefined();
  });

//Verifico que se retorna un array con todos los productos

  it('should return an array of products successfully', async () => {
    const products: Product[] = [
      { id: '1', name: 'Product 1', description: 'Description 1', price: 100 },
      { id: '2', name: 'Product 2', description: 'Description 2', price: 200 },
    ];
// simulo una llamada a FindAll() y le digo que me devuelva products
    jest.spyOn(service, 'findAll').mockImplementation(async () => products);
//llamamos al controlador real y guardamos el resultado en result
    const result = await controller.findAll();
//verificamos que el resultado de controller.findAll() sea igual a products
    expect(result).toEqual(products);
  });

//verifico que findAll devuelve un array y que ese array tiene la longitud correcta

  it('should return an array of products and match the length', async () => {
    const products: Product[] = [
      { id: '1', name: 'Product 1', description: 'Description 1', price: 100 },
      { id: '2', name: 'Product 2', description: 'Description 2', price: 200 },
    ];

    jest.spyOn(service, 'findAll').mockImplementation(async () => products);

    const result = await controller.findAll();
//esto --Array.isArray(result)-- devuelve true si result es un array
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(products.length);
  });

//verifico que lanza NotFoundException sino se encuentran productos 

  it('should throw NotFoundException if products not found', async () => {
    jest.spyOn(service, 'findAll').mockImplementation(async () => {
      throw new NotFoundException('Not found');
    });

    await expect(async () => controller.findAll()).rejects.toThrow(new HttpException('Not found', HttpStatus.NOT_FOUND));
  });
});

// --------------------FIND ONE-----------------------

  describe("findOne", () => {
    it("should be defined", () => {
      expect(controller.findOne).toBeDefined();
    });

// verifico que el controlador devuelve correctamente un producto cuando se encuentra
    it("should return product when found", async () => {
      const productId = "1";
      const product: Product = { id: "1", name: "Product 1", description: "Description 1", price: 100 };

      jest.spyOn(service, "findOne").mockImplementation(async () => product);

      const result = await controller.findOne(productId);

      expect(result).toEqual(product);
    });

    //verifico que lanza NotFoundException cuando no se encuentra el producto por el ID
    it("should throw NotFoundException if product not found", async () => {
      const productId = '999';

      jest.spyOn(service, "findOne").mockImplementation(async () => {
        throw new NotFoundException(`Not Found`);
      });

      await expect(async () => await controller.findOne(productId)).rejects.toThrow(new HttpException("Not found", HttpStatus.NOT_FOUND));
    });
  });

// --------------------CREATE-----------------------

  describe("create", () => {
    it("should be defined", () => {
      expect(controller.create).toBeDefined();
    });

//Verifico que el producto se crea

    it("should create a product", async () => {
      const createProductDto: CreateProductDto = { name: "Product 1", description: "Description 1", price: 100 };

      const product = { ...createProductDto, id: "1" };

      jest.spyOn(service, "create").mockImplementation(async () => product);

      const result = await controller.create(createProductDto);

      expect(result).toEqual(product);
    });

//Verifico que me lanza un error de tipo BadRequestException cuando hay datos invalidos

    it("should throw BadRequestException on creation failure for invalid data", async () => {
      const createProductDto: CreateProductDto = { name: null, description: "Description 1", price: -50 };

      jest.spyOn(service, "create").mockImplementation(async () => {
        throw new BadRequestException("Invalid data");
      });

      await expect(async () => await controller.create(createProductDto)).rejects.toThrow(new BadRequestException("Invalid data"));
    });

//verifico que el controlador devuelve un producto con un ID válido al crear

    it('should create a product with a valid ID', async () => {
      const createProductDto: CreateProductDto = { name: 'Product 1', description: 'Description 1', price: 100 };

      const result = await controller.create(createProductDto);

      expect(result.id).toBeTruthy();
      expect(typeof result.id).toBe('string');
    });
  });

// --------------------UPDATE-----------------------

  describe("update", () => {
    it("should be defined", () => {
      expect(controller.update).toBeDefined();
    });

//Verifico que se actualiza un producto

    it("should update a product", async () => {
      const product: Product = { id: "1", name: "Product 1", description: "Description 1", price: 100 };

      const updateProductDto: UpdateProductDto = { description: "DescriptionUpdate" };

      const updateProductMock = { ...product, ...updateProductDto };

      jest.spyOn(service, "update").mockImplementation(async () => updateProductMock);

      const result = await controller.update(product.id, updateProductDto);

      expect(result).toEqual(updateProductMock);
    });

//verifico que lanza NotFoundException cuando debe

    it("should throw NotFoundException on update failure", async () => {
      const productId = "899";
      const updateProductDto: UpdateProductDto = { name: "nameUpdate" };

      jest.spyOn(service, "update").mockImplementation(async () => {
       throw new NotFoundException("Update failed");
      });

      await expect(async () => await controller.update(productId, updateProductDto)).rejects.toThrow(new HttpException("Update failed", HttpStatus.NOT_FOUND));
    });

    //Verifico que lanza BadRequestException cuando quiero actualizar con datos invalidos
    it("should throw NotFoundException on updating a product with invalid data", async () => {
      const productId = "1";
      const updateProductDto: UpdateProductDto = { description: null };

      jest.spyOn(service, "update").mockImplementation(async () => {
        throw new BadRequestException("Invalid data");
      });

      await expect(async () => await controller.update(productId, updateProductDto)).rejects.toThrow(new HttpException("Invalid data", HttpStatus.BAD_REQUEST));
    });
  });
  
// ----------------------REMOVE-------------------------

  describe("remove", () => {
    it("should be defined", () => {
      expect(controller.remove).toBeDefined();
    });

//verifico que se elimina un producto correctamente

    it("should remove a product", async () => {
      const productId = "1";
      const productMock = { id: "1", name: "Product 1", description: "Description 1", price: 100 };

      jest.spyOn(service, "remove").mockImplementation(async () => productMock);

      const result = await controller.remove(productId);

      expect(result).toEqual(productMock);
    });

//verifico que lanza NotFoundException cuando no se encuentra el ID

    it("should throw NotFoundException on delete failure", async () => {
      const productId = "1";

      jest.spyOn(service, "remove").mockImplementation(async () => {
        throw new NotFoundException("Delete failed")
      });

      await expect(async () => await controller.remove(productId)).rejects.toThrow(new HttpException("Delete failed", HttpStatus.NOT_FOUND));
    });
  });
});



