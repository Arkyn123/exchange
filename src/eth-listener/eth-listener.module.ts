import { Module } from '@nestjs/common';
import { OrderModule } from 'src/order/order.module';

@Module({
    imports: [OrderModule]
})
export class EthListenerModule { }
