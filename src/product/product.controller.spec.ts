import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';
import {BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

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


  describe("findAll", () => {

    it("should be defined", () => {
      expect(controller.findAll).toBeDefined();
    });

     it("should return an array of products successfully", () => {
      const products: Product[] = [
        {id: "1", name: "Product 1", description: "Description 1", price: 100},
        {id: "2", name: "Product 2", description: "Description 2", price: 200},
      ];

      jest.spyOn(service, "findAll").mockImplementation(() => products);

      const result = controller.findAll();

      expect(result).toEqual(products);

    });

    it("should throw NotFoundException if products not found", () => {

      jest.spyOn(service, "findAll").mockImplementation(() => {
        throw new Error("Not found");
      });
      
      expect(() => controller.findAll()).toThrow(new NotFoundException("Not found"));
    });


  });




  describe("findOne", () => {
    it("should be defined", () => {
      expect(controller.findOne).toBeDefined();
    });

    it("should return product when found", () => {
      const productId = "1";
      const product:Product = {id: "1", name: "Product 1", description: "Description 1", price: 100};

      jest.spyOn(service, "findOne").mockImplementation(() => product);

      const result = controller.findOne(productId);

      expect(result).toEqual(product);
    });

    it("should throw NotFoundException if product not found", () => {

      const productId = '1';

      jest.spyOn(service, "findOne").mockImplementation(() => {
        throw new Error("Not found");
      });

      expect(() => controller.findOne(productId)).toThrow(new NotFoundException("Not found"));
    });

    
  });


  describe("create", () => {

    it("should be defined", () => {
      expect(controller.create).toBeDefined();
    });

    it("should create a product", () => {
      const createProductDto: CreateProductDto = {name: "Product 1", description: "Description 1", price: 100};

      const product = {...createProductDto, id: "1"};

      jest.spyOn(service, "create").mockImplementation(() => product);

      const result = controller.create(createProductDto);

      expect(result).toEqual(product);
    });

    it("should throw BadRequestException on creation failure", () => {
      const createProductDto: CreateProductDto = {name: "Product 1", description: "Description 1", price: 100};

      jest.spyOn(service, "create").mockImplementation(() => {
        throw new Error("Created failed");
      });

      expect(() => controller.create(createProductDto)).toThrow(BadRequestException);
    });
  });




  describe("update", () => {

    it("should be defined", () => {
      expect(controller.update).toBeDefined();
    });

    it("should update a product", () => {
      
      const product: Product = {id: "1", name: "Product 1", description: "Description 1", price: 100};

      const updateProductDto: UpdateProductDto = {description: "DescriptionUpdate"};
      
      const updateProductMock = {...product, ...updateProductDto };

      jest.spyOn(service, "update").mockImplementation(() => updateProductMock);

      const result = controller.update(product.id, updateProductDto);

      expect(result).toEqual(updateProductMock);
    });

    it("should throw NotFoundException on update failure", () => {
      const productId = "899";
      const updateProductDto: UpdateProductDto = { name: "nameUpdate" };

      jest.spyOn(service, "update").mockImplementation(() => {
        throw new Error(`Product with ID ${productId} not found`);
      });

      expect(() => controller.update(productId, updateProductDto)).toThrow(NotFoundException);
    });

  });

  describe("remove", () => {

    it("should be defined", () => {
      expect(controller.remove).toBeDefined();
    });

      it("should remove a product", () => {
        const productId = "1";
        const productMock = {id: "1", name: "Product 1", description: "Description 1", price: 100};
  
        jest.spyOn(service, "remove").mockImplementation(() => productMock);
  
        const result = controller.remove(productId);
  
        expect(result).toEqual(productMock);
      });

      it("should throw NotFoundException on delete failure", () => {
        const productId = "1";
  
        jest.spyOn(service, "remove").mockImplementation(() => {
          throw new Error(`Product with ID ${productId} not found`);
        });
  
        expect(() => controller.remove(productId)).toThrow(NotFoundException);
      });
  });



});



