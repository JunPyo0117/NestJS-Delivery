import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Product } from './entity/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async getProductsInfo(productIds: string[]) {
    const products = await this.productRepository.find({
      where: {
        id: In(productIds),
      },
    });
    return products;
  }

  async createSamples() {
    const data = [
      {
        name: '사과',
        price: 10000,
        description: '맛있는 청주사과',
        stock: 2,
      },
      {
        name: '메론',
        price: 15000,
        description: '맛있는 노트메론',
        stock: 1,
      },
      {
        name: '포도',
        price: 20000,
        description: '맛있는 노트포도',
        stock: 1,
      },
      {
        name: '수박',
        price: 30000,
        description: '맛있는 노트수박',
        stock: 1,
      },
      {
        name: '토마토',
        price: 40000,
        description: '맛있는 노트토마토',
        stock: 1,
      },
    ];

    await this.productRepository.save(data);

    return true;
  }
}
