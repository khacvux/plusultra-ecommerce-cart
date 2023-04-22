import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { redisModule } from 'src/redis/redis.module.config';

@Module({
  imports: [redisModule],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
