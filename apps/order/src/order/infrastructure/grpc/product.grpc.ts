import { Inject, OnModuleInit } from '@nestjs/common';
import { ProductOutputPort } from '../../port/output/product.output-port';
import { PRODUCT_SERVICE, ProductMicroservice } from '@app/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { ProductEntity } from '../../domain/product.entity';
import { lastValueFrom } from 'rxjs';
import { GetProductsInfoResponseMapper } from './mapper/products-info-response.mapper';

export class ProductGrpc implements ProductOutputPort, OnModuleInit {
  productService: ProductMicroservice.ProductServiceClient;

  constructor(
    @Inject(PRODUCT_SERVICE)
    private readonly productMicroservice: ClientGrpc,
  ) {}

  onModuleInit() {
    this.productService =
      this.productMicroservice.getService<ProductMicroservice.ProductServiceClient>(
        'ProductService',
      );
  }

  async getProductsByIds(productIds: string[]): Promise<ProductEntity[]> {
    const resp = await lastValueFrom(
      this.productService.getProductsInfo({ productIds }),
    );
    return new GetProductsInfoResponseMapper(resp).toDomain();
  }
}
