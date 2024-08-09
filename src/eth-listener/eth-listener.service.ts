import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { OrderService } from 'src/order/order.service';
import Web3 from 'web3';
import { abi } from './abi';

@Injectable()
export class EthListenerService implements OnModuleInit {
    private web3: Web3
    private contractAddr: string = '0xa26761BC436aC2b280c092D1D6FCa56e9728cbb8'
    private contract: any

    constructor(
        @Inject(OrderService) private readonly orderService: OrderService
    ) { }

    async onModuleInit() {
        this.orderService.test()
        this.web3 = new Web3(new Web3.providers.WebsocketProvider('wss://arbitrum-mainnet.io/ws/v3/398f8a9407bd45189b02a5d27311a8bb'));
        this.contract = new this.web3.eth.Contract(abi, this.contractAddr);
    }
}
