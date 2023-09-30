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
import * as moment from 'moment';
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

    return 'success'
  }

  async getOrder(user: User, getListProductInput: GetListProductInput) {
    const { page, limit } = getListProductInput;
    let conditionPage = {}
    if (page && limit) {
      const skip = (page - 1) * limit;
      conditionPage = {
        take: limit,
        skip: skip,
      }
    }
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
      ...conditionPage,
      relations: {
        listProduct: {
          product: true
        },
        user: true
      }
    });
    return listProduct;
  }

  async getStatisticaCart() {
    const currentDate = moment();
    const currentYear = currentDate.year();
    // const hiringCompany = await UserCompanyEntity.findOne({
    //   where: { userId: user.id }
    // })
    let condition = ''
    // if (!hiringCompany && user.role == Role.HIRING_COMPANY) {
    //   throw new NotFoundException('company_not_found')
    // }
    // if (user.role == Role.HIRING_COMPANY) {
    //   condition = ` and jobs.company_id = ${hiringCompany.id}`
    // }
    let querySelect = '';
    let queryWhere = '';
    let queryGroupBy = '';
    let daysDifference;
    // if (type == TypeStatistical.MONTH) {
    //   const currentMonth = currentDate.month() + 1;
    //   const startOfYear = moment().startOf('year');
    //   const startOfMonth = moment().startOf('month');
    //   daysDifference = startOfMonth.diff(startOfYear, 'week');
    //   querySelect = ',  WEEK(ap.created_at) AS week';
    //   queryWhere = ` and MONTH(ap.created_at) = ${currentMonth}`;
    //   queryGroupBy = `, WEEK(ap.created_at)`;
    // }
    const result = await this.repository
      .createQueryBuilder('ap')
      .select(
        `MONTH(ap.created_at) AS month ${querySelect}, COUNT(*) AS amount`,
      )
      // .leftJoin(`ap.job`, `jobs`, `jobs.id = ap.job_id`)
      .where(
        `YEAR(ap.created_at) = :year ${queryWhere} ${condition}`,
        { year: currentYear },
      )
      .groupBy(`MONTH(ap.created_at) ${queryGroupBy}`)
      .getRawMany();

    // if (type == TypeStatistical.MONTH) {
    //   return result.map((item) => {
    //     return { ...item, week: item.week - daysDifference };
    //   });
    // }
    if (result) {
      let length = result.length
      if (result.length < 6) {
        for (let i = 1; i <= 6 - length; i++) {
          result.push({
            "month": result[length - 1].month - i,
            "amount": 0
          })
        }
      } else {
        return result.slice(-6)
      }
      return result;
    } else {
      return []
    }
  }

  async getStatisticalUserRevenue() {
    const currentDate = moment();
    const currentYear = currentDate.year();
    // const hiringCompany = await UserCompanyEntity.findOne({
    //   where: { userId: user.id }
    // })
    let condition = ''
    // if (!hiringCompany && user.role == Role.HIRING_COMPANY) {
    //   throw new NotFoundException('company_not_found')
    // }
    // if (user.role == Role.HIRING_COMPANY) {
    //   condition = ` and jobs.company_id = ${hiringCompany.id}`
    // }
    let querySelect = '';
    let queryWhere = '';
    let queryGroupBy = '';
    let daysDifference;
    // if (type == TypeStatistical.MONTH) {
    //   const currentMonth = currentDate.month() + 1;
    //   const startOfYear = moment().startOf('year');
    //   const startOfMonth = moment().startOf('month');
    //   daysDifference = startOfMonth.diff(startOfYear, 'week');
    //   querySelect = ',  WEEK(ap.created_at) AS week';
    //   queryWhere = ` and MONTH(ap.created_at) = ${currentMonth}`;
    //   queryGroupBy = `, WEEK(ap.created_at)`;
    // }
    const result = await this.repository
      .createQueryBuilder('ap')
      .select(
        `MONTH(ap.created_at) AS month ${querySelect}, SUM(total_money) AS amount`,
      )
      // .leftJoin(`ap.job`, `jobs`, `jobs.id = ap.job_id`)
      .where(
        `YEAR(ap.created_at) = :year ${queryWhere} ${condition}`,
        { year: currentYear },
      )
      .groupBy(`MONTH(ap.created_at) ${queryGroupBy}`)
      .getRawMany();

    // if (type == TypeStatistical.MONTH) {
    //   return result.map((item) => {
    //     return { ...item, week: item.week - daysDifference };
    //   });
    // }
    if (result) {
      let length = result.length
      if (result.length < 6) {
        for (let i = 1; i <= 6 - length; i++) {
          result.push({
            "month": result[length - 1].month - i,
            "amount": 0
          })
        }
      } else {
        return result.slice(-6)
      }
      return result;
    } else {
      return []
    }
  }
}
