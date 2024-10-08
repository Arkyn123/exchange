import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { OrderModule } from './order/order.module';
import { EthListenerService } from './eth-listener/eth-listener.service';
import { EthListenerModule } from './eth-listener/eth-listener.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'db',
      port: 5432,
      username: 'postgres',
      password: 'root',
      database: 'exchange_base',
      autoLoadModels: true,
      synchronize: true,
    }),
    OrderModule,
    EthListenerModule,
  ],
})
export class AppModule { }
