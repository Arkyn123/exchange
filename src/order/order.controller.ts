import { Controller, Get, ParseBoolPipe, ParseIntPipe, Query } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @Get('getOrders')
  async getOrders(
    @Query('tokenA') tokenA?: string,
    @Query('tokenB') tokenB?: string,
    @Query('user') user?: string,
    @Query('active', ParseBoolPipe) active?: boolean,
  ) {
    return this.orderService.getOrders(tokenA, tokenB, user, active);
  }

  @Get('getMatchingOrders')
  async getMatchingOrders(
    @Query('tokenA') tokenA: string,
    @Query('tokenB') tokenB: string,
    @Query('amountA', ParseIntPipe) amountA: number,
    @Query('amountB', ParseIntPipe) amountB: number,
  ) {
    return this.orderService.getMatchingOrders(tokenA, tokenB, amountA, amountB);
  }
}
