import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductDto } from './dto/product.dto';
import { ProductEntity } from './product.entity';
import { ProductRepository } from './product.repository';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: ProductRepository,
  ) {}

  async getProducts(): Promise<ProductEntity[]> {
    const products = await this.productRepository.find();

    return products;
  }

  async getProductsByName(name: string): Promise<ProductEntity> {
    const product = await this.productRepository.findOne({ name });
    if (!product) throw new NotFoundException('Product not exists');
    return product;
  }

  async getProductsById(id: string): Promise<ProductEntity> {
    const product = await this.productRepository.findOne(id);
    return product;
  }

  async createProduct(productDto: ProductDto): Promise<ProductDto> {
    try {
      const product = await this.productRepository.save(productDto);
      delete product.id;
      return product;
    } catch (error) {
      if (error.code === '23505')
        throw new ConflictException('Product already exists');

      throw new InternalServerErrorException();
    }
  }
  async updateProduct(id: string, productDto: ProductDto) {
    const product = await this.productRepository.findOne(id);

    if (!product) throw new NotFoundException();

    product.name = productDto.name ? productDto.name : product.name;
    product.price = productDto.price ? productDto.price : product.price;
    return await this.productRepository.save(product);
  }

  async deleteProduct(id: string) {
    await this.productRepository.delete(id);
  }
}
