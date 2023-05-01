import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateCartDto, DeleteCartItemDto, UpdateCartDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { IORedisKey } from 'src/redis/redis.module';
import { Redis } from 'ioredis';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { NotFoundException, ServerErrorException } from './exceptions';
import { AmqpConnection, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';

const EXPIRESIN: number = 7 * 24 * 60 * 60;

@Injectable()
export class CartService {
  constructor(
    @Inject(IORedisKey) private readonly redisClient: Redis,
    private readonly prisma: PrismaService,
    private readonly amqpConnection: AmqpConnection,
  ) {}

  async create(dto: CreateCartDto) {
    try {
      // const existedItem = await this.prisma.cartItem.fin
      let quantityExisted = await this.redisClient.get(
        this._productQuantityKey(dto.productId),
      );
      // set product quantity to cache if not exist
      if (!quantityExisted) {
        const product = await this.prisma.product.findUnique({
          where: {
            id: dto.productId,
          },
          select: {
            id: true,
            inventory: {
              select: {
                quantity: true,
              },
            },
          },
        });

        const notfound = {
          message: 'product not found',
        };
        if (!product) return notfound;
        await this.redisClient.setnx(
          this._productQuantityKey(dto.productId),
          product.inventory.quantity,
        );
        quantityExisted = product.inventory.quantity.toString();
      }

      let productSold: string | number = await this.redisClient.get(
        this._productSoldKey(dto.productId),
      );
      if (!productSold) {
        await this.redisClient.setnx(this._productSoldKey(dto.productId), 0);
      }

      productSold = await this.redisClient.incrby(
        this._productSoldKey(dto.productId),
        dto.quantity,
      );

      if (+productSold > +quantityExisted) {
        await this.redisClient.decrby(
          this._productSoldKey(dto.productId),
          dto.quantity,
        );
        const soldoutResponse = {
          message: 'sold out',
        };
        return soldoutResponse;
      }

      //RMQ
      await this.amqpConnection.publish('ec.cart', 'ec.cart.additem', dto);

      return {
        message: 'added',
      };
    } catch (error) {
      return new BadRequestException();
    }
  }

  async findAll(userId: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          carts: {
            select: {
              userId: true,
              quantity: true,
              product: {
                select: {
                  name: true,
                  desc: true,
                  images: true,
                  price: true,
                  moneyType: {
                    select: {
                      type: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
      return {
        data: user.carts,
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code == 'P2002') {
          throw new NotFoundException();
        }
      }
      throw error;
    }
  }

  async findOne(id: number) {
    return `This action returns a #${id} cart`;
  }

  async update(id: number, updateCartDto: UpdateCartDto) {
    return `This action updates a #${id} cart`;
  }

  // async remove(dto: DeleteCartItemDto) {
  //   try {
  //     const cartItem = await this.prisma.cartItem.findUnique({
  //       where: {
  //         userId_productId: {
  //           userId: dto.userId,
  //           productId: dto.
  //         }

  //       },
  //       select: {
  //         productId: true,
  //         quantity: true,
  //       },
  //     });
  //     await this.prisma.cartItem.delete({
  //       where: {
  //         id: dto.cartItemId,
  //       },
  //     });
  //     await this.redisClient.decrby(
  //       this._productSoldKey(cartItem.productId),
  //       cartItem.quantity,
  //     );
  //     return {
  //       message: 'deleted',
  //     };
  //   } catch (error) {
  //     throw new ServerErrorException();
  //   }
  // }

  _productQuantityKey(productId: number): string {
    return `pq:${productId}`;
  }

  _productSoldKey(productId: number): string {
    return `ps:${productId}`;
  }

  @RabbitSubscribe({
    exchange: 'ec.cart',
    routingKey: 'ec.cart.additem',
    queue: 'add-cart-queue',
  })
  async addCartItem(dto: CreateCartDto) {
    try {
      await this.prisma.cartItem.create({
        data: {
          userId: dto.userId,
          productId: dto.productId,
          quantity: dto.quantity,
        },
      });
    } catch (error) {
      console.log(error.name, ':::', error.message);
    }
  }
}
