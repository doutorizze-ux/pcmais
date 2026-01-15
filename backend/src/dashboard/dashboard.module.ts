import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { LeadsModule } from '../leads/leads.module';
import { ProductsModule } from '../products/products.module';
import { UsersModule } from '../users/users.module';
import { PlansModule } from '../plans/plans.module';

@Module({
    imports: [LeadsModule, ProductsModule, UsersModule, PlansModule],
    controllers: [DashboardController]
})
export class DashboardModule { }
