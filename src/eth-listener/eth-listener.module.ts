import { Module } from '@nestjs/common';
import { OrderModule } from 'src/order/order.module';
import { EthListenerService } from './eth-listener.service';

@Module({
    imports: [OrderModule],
    providers: [EthListenerService]
})
export class EthListenerModule { }
