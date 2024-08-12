import { BadRequestException, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { OrderService } from 'src/order/order.service';
import Web3, { Contract, EthExecutionAPI, EventLog, SupportedProviders } from 'web3';
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

    private async getAbi(adress: string) {
        const url = `https://api-sepolia.etherscan.io/api?module=contract&action=getabi&address=${adress}&apikey=${process.env.ETHSCAN_KEY}`
        const res = await axios.get(url)
        if (res.data.message !== 'OK')
            throw new BadRequestException('Ошибка при получении abi ' + adress)

        return JSON.parse(res.data.result)
    }

}
