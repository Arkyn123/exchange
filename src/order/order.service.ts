import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { IOrder, Order } from './entity/order.model';
import { WhereOptions } from 'sequelize';

@Injectable()
export class OrderService {

    constructor(
        @InjectModel(Order) private readonly orderRepository: typeof Order
    ) { }

    async upsertOrders(orders: IOrder[]) {
        return await Promise.all(orders.map(el => this.orderRepository.upsert(el)))
    }

    async getOrders(tokenA: string, tokenB: string, user: string, active: boolean) {
        const where: WhereOptions<Order> = {}
        tokenA ? where.tokenA = tokenA : null
        tokenB ? where.tokenB = tokenB : null
        user ? where.user = user : null
        active ? where.active = active : null

        return await this.orderRepository.findAll({ where })
    }

    getMatchingOrders(tokenA: string, tokenB: string, amountAParsed: number, amountBParsed: number) {
        console.log(this.getMatchingOrders.name);
    }
}
