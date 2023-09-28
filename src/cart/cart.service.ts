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
import { Product } from 'entities/product.entity';
@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly repository: Repository<Cart>,
  ) { }

  async getCart(getCartInput: GetCartInput, user: User) {
    const { page, limit } = getCartInput;

    // const skip = (page - 1) * limit;
    let conditionPage = {}
    if (page && limit) {
      const skip = (page - 1) * limit;
      conditionPage = {
        take: limit,
        skip: skip,
      }
    }
    const result = await this.repository.find({
      where: { userId: user.id },
     ...conditionPage,
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
    const product = await Product.findOne({ where: { id: productId } });
    let status = 1
    if (product.amount == -1) {
      status = 0
    }
    await Product.update(productId, {
      amount: product.amount - 1, status
    })
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
