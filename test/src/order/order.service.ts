import {
  Injectable, NotFoundException,

} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from 'entities/cart.entity';
import { OrderProduct } from 'entities/order-product.entity';
import { Order } from 'entities/order.entity';
import { Product } from 'entities/product.entity';
import { User } from 'entities/user.entity';
import { StatusCart } from 'src/cart/cart.constants';
import { GetListProductInput } from 'src/product/dto/product.dto';
import { Repository } from 'typeorm';
import { CreateOrderInput } from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly repository: Repository<Order>,
  ) { }

  async paymentOrders(user: User) {
    const cart = await Cart.find({
      where: {
        userId: user.id
      },
      relations: ['product']
    })
    if (cart.length == 0) throw new NotFoundException('cart_empty')
    const totalMoney = cart.reduce((total, item) => { return total + item.product.price }, 0)
    const order = await this.repository.save({
      userId: user.id,
      totalMoney
    })
    await Promise.all(cart.map((item) => {
      const orderProduct = new OrderProduct()
      orderProduct.productId = item.productId
      orderProduct.amount = item.amount
      orderProduct.price = item.product.price
      orderProduct.orderId = order.id
      return orderProduct.save()
    }))

    await Cart.update({ userId: user.id, status: StatusCart.IN_CART }, {
      status: StatusCart.BOUGHT
    })

    return 'Success'
  }

  async getOrder(user: User, getListProductInput: GetListProductInput) {
    const { page, limit } = getListProductInput;
    const skip = (page - 1) * limit;
    const listProduct = await this.repository.find({
      select: {
        listProduct: {
          id: true,
          productId: true,
          amount: true,
          price: true,
          product: {
            name: true
          }
        }
      },
      take: limit,
      skip: skip,
      relations: {
        listProduct: {
          product: true
        },
        user: true
      }
    });
    return listProduct;
  }
}
