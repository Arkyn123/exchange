import { BadRequestException, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { OrderService } from 'src/order/order.service';
import Web3, { Contract, EventLog } from 'web3';
import axios from 'axios';
import { IOrder } from 'src/order/entity/order.model';

@Injectable()
export class EthListenerService implements OnModuleInit {
    private web3: Web3
    private contract: Contract<any>

    constructor(
        @Inject(OrderService) private readonly orderService: OrderService
    ) { }

    async onModuleInit() {
        this.web3 = new Web3('wss://sepolia.infura.io/ws/v3/' + process.env.INFURA_KEY);

        const abi = await this.getAbi(process.env.CONTRACT)

        this.contract = new this.web3.eth.Contract<typeof abi>(abi, process.env.CONTRACT);

        await Promise.all([
            this.updateOrders(),
            this.subscribeToOrderCreated(),
            this.subscribeToOrderCancelled(),
            this.subscribeToOrderMatched()
        ])
    }

    private async getAbi(adress: string) {
        const url = `https://api-sepolia.etherscan.io/api?module=contract&action=getabi&address=${adress}&apikey=${process.env.ETHSCAN_KEY}`
        const res = await axios.get(url)
        if (res.data.message !== 'OK')
            throw new BadRequestException('Ошибка при получении abi ' + adress)

        return JSON.parse(res.data.result)
    }

    private async updateOrders() {
        await this.contract.getPastEvents('OrderCreated', {
            fromBlock: 0,
            toBlock: 'latest'
        }).then(async events => {

            const orders = events.map(el => {

                const { id, amountA, amountB, tokenA, tokenB, user, isMarket } = (el as EventLog).returnValues;
                return { id, amountA, amountB, tokenA, tokenB, user, active: isMarket }
            }) as IOrder[]

            await this.orderService.upsertOrders(orders)
        }).catch(error => {
            console.error(error.message);
        });
    }

    private async subscribeToOrderCreated() {
        const orderCreated = this.contract.events.OrderCreated()
        orderCreated.on('connected', () => console.log('Successful subscription to order creation'));
        orderCreated.on('error', (error) => console.error('Error while creating order: ' + error.message));
        orderCreated.on('data', async (data) => {
            const { id, amountA, amountB, tokenA, tokenB, user, isMarket } = (data as EventLog).returnValues;
            await this.orderService.upsertOrder({ id, amountA, amountB, tokenA, tokenB, user, active: isMarket } as IOrder);
        });
    }

    private async subscribeToOrderCancelled() {
        const orderCancelled = this.contract.events.OrderCancelled()
        orderCancelled.on('connected', () => console.log('Successful subscription to cancel an order'));
        orderCancelled.on('error', (error) => console.error('Error while order cancelling: ' + error.message));
        orderCancelled.on('data', async (data) => {
            const { id, isMarket } = (data as EventLog).returnValues;
            await this.orderService.changActive(id as string, !!isMarket);
        });
    }

    private async subscribeToOrderMatched() {
        const orderMatched = this.contract.events.OrderMatched()
        orderMatched.on('connected', () => console.log('Successful subscription to order matches'));
        orderMatched.on('error', (error) => console.error('Error while order matching: ' + error.message));
        orderMatched.on('data', async (data) => {
            const { id, amountReceived, amountLeftToFill } = (data as EventLog).returnValues;
            if (amountReceived == amountLeftToFill)
                await this.orderService.changActive(id as string, false);
        })
    }
}
