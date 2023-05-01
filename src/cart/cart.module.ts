import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { redisModule } from 'src/redis/redis.module.config';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';

@Module({
  imports: [
    redisModule,
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: 'ec.cart',
          type: 'topic',
        },
      ],
      uri: 'amqp://vukhac:123@localhost:5672',
    }),
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}


