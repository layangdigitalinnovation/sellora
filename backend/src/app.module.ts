import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { StoresModule } from './stores/stores.module';
import { ProductsModule } from './products/products.module';
import { PaymentsModule } from './payments/payments.module';
import { CustomersModule } from './customers/customers.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { AdminModule } from './admin/admin.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { WithdrawalsModule } from './withdrawals/withdrawals.module';
import { StorageModule } from './storage/storage.module';
import { BookingsModule } from './bookings/bookings.module';
import { BlogsModule } from './blogs/blogs.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule, 
    AuthModule, 
    UsersModule, 
    StoresModule, 
    ProductsModule, 
    PaymentsModule,
    CustomersModule,
    AnalyticsModule,
    AdminModule,
    SubscriptionsModule,
    WithdrawalsModule,
    StorageModule,
    BookingsModule,
    BlogsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
