import { Module } from '@nestjs/common';
import { OrderModule } from './order/order.module';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [OrderModule, ProductModule, AuthModule],
})
export class AppModule {}
