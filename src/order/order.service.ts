import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { IOrder, Order } from './entity/order.model';
import { WhereOptions } from 'sequelize';

@Injectable()
export class OrderService {

    constructor(
        @InjectModel(Order) private readonly orderRepository: typeof Order
    ) { }

    async upsertOrders(orders: IOrder[]) {
        return await this.orderRepository.bulkCreate(orders, { updateOnDuplicate: ['active'] })
    }

    async upsertOrder(order: IOrder) {
        return await this.orderRepository.upsert(order)
    }

    async changActive(id: string, active: boolean) {
        const order = await this.orderRepository.findByPk(id)
        if (!order) throw new NotFoundException('Ордер не найден!')
        return await order.update({ active })
    }

    async getOrders(tokenA: string, tokenB: string, user: string, active: boolean) {
        const where: WhereOptions<Order> = {}
        tokenA ? where.tokenA = tokenA : null
        tokenB ? where.tokenB = tokenB : null
        user ? where.user = user : null
        where.active = active

        return await this.orderRepository.findAll({ where })
    }

    async getMatchingOrders(tokenA: string, tokenB: string, amountA: number, amountB: number) {
        const where: WhereOptions<Order> = {}
        amountA != 0 ? where.amountA = amountA : null

        const orders = await this.orderRepository.findAll({
            where: { tokenA, tokenB, amountB, active: true },
            attributes: ['id']
        })
        return orders.map(el => el.id)
    }
}
