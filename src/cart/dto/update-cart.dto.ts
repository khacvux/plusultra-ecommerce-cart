import { PartialType } from '@nestjs/mapped-types';
import { CreateCartDto } from './create-cart.dto';

export class UpdateCartDto {
  userId: number;
  cartItemId: number;
  quantity: number;
}
