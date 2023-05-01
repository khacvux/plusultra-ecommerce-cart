import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { DeleteCartItemDto } from './dto';

@Controller()
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @MessagePattern('create_cart_item')
  create(@Payload() dto: CreateCartDto) {
    return this.cartService.create(dto);
  }

  @MessagePattern('get_cart')
  findAll(@Payload() { userId }: { userId: number }) {
    return this.cartService.findAll(userId);
  }

  @MessagePattern('get_cart_item')
  findOne(@Payload() id: number) {
    return this.cartService.findOne(id);
  }

  @MessagePattern('update_cart_item')
  update(@Payload() updateCartDto: UpdateCartDto) {}

  // @MessagePattern('delete_cart_item')
  // remove(@Payload() dto: DeleteCartItemDto) {
  //   return this.cartService.remove(dto);
  // }
}
