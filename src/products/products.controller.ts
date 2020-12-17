import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { RolesDecorator } from 'src/docorators/roles.decorator';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { RolesEnum } from 'src/roles/roles.enum';
import { ProductDto } from './dto/product.dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productService: ProductsService, // private readonly configService: ConfigService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator(RolesEnum.ADMIN, RolesEnum.USER)
  @Get()
  async getProducts() {
    return await this.productService.getProducts();
  }

  @Get('/name/:name')
  async getProductsByName(@Param('name') name: string): Promise<ProductDto> {
    return await this.productService.getProductsByName(name);
  }
  @Get(':id')
  async getProductsById(
    @Param('id', new ParseUUIDPipe())
    id: string,
  ): Promise<ProductDto> {
    return await this.productService.getProductsById(id);
  }

  @Post()
  async createProduct(@Body() productDto: ProductDto) {
    return this.productService.createProduct(productDto);
  }

  @Put(':id')
  async updateProduct(@Param('id') id: string, @Body() productDto: ProductDto) {
    return this.productService.updateProduct(id, productDto);
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    return this.productService.deleteProduct(id);
  }
}
