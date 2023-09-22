import {
  Controller, Get, Post, Query, UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from 'entities/user.entity';
import { GetListProductInput } from 'src/product/dto/product.dto';
import { UserScope } from 'src/user/decorators/user.decorator';
import { JwtAuthGuard } from 'src/user/guards/jwt-auth.guard';
import { OrderService } from './order.service';



@ApiTags('Order')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async createOrder(
    @UserScope() user: User,
  ) {
    return this.orderService.paymentOrders(user);
  }

    
  @Get()
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  async getOrder(
    @UserScope() user: User, 
    @Query() getListProductInput: GetListProductInput
  ) {
    return this.orderService.getOrder(user,getListProductInput);
  }
}