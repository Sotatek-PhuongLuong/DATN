import { ForbiddenException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from 'entities/cart.entity';
import {
  AddProductInput,
  GetCartInput,
  UpdateProductInput,
} from './dto/cart.dto';
import { User } from 'entities/user.entity';
import { TypeUpdateProduct } from './cart.constants';
@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly repository: Repository<Cart>,
  ) {}

  async getCart(getCartInput: GetCartInput, user: User) {
    const { page, limit } = getCartInput;

    const skip = (page - 1) * limit;
    const result = await this.repository.find({
      where: { userId: user.id },
      take: limit,
      skip: skip,
      relations: {
        product: {
          listImage: true,
        },
      },
    });

    return result;
  }

  async addProductInCart(addProductInput: AddProductInput, user: User) {
    const { productId, amount } = addProductInput;
    const _cart = await this.repository.findOne({
      where: {
        productId,
        userId: user.id,
      },
    });
    if (_cart) {
      await this.repository.update(
        { id: _cart.id },
        { amount: _cart.amount + 1 },
      );
    } else {
      await this.repository.save({
        productId: productId,
        userId: user.id,
        amount: amount,
      });
    }
    return 'Success';
  }

  async updateProductInCart(
    dto: UpdateProductInput,
    user: User,
    cartId: number,
  ) {
    const { type } = dto;
    const _cart = await this.repository.findOne({
      where: {
        id: cartId,
      },
    });
    if (_cart.userId != user.id) throw new ForbiddenException('not_permission');
    if (type == TypeUpdateProduct.MINUS && _cart.amount == 1) {
      await this.repository.delete({ id: cartId });
      return 'Success';
    }

    const amount =
      type == TypeUpdateProduct.MINUS ? _cart.amount - 1 : _cart.amount + 1;
    await this.repository.update({ id: cartId }, { amount });
    return 'Success';
  }

  async deleteProductInCart(user: User, cartId: number) {
    const _cart = await this.repository.findOne({
      where: {
        id: cartId,
      },
    });
    if (_cart.userId != user.id) throw new ForbiddenException('not_permission');
    await this.repository.delete({ id: cartId });
    return 'Success';
  }
}
