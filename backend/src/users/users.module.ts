import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { ProductsModule } from '../products/products.module';
import { PlansModule } from '../plans/plans.module';

@Module({
    imports: [TypeOrmModule.forFeature([User]), forwardRef(() => ProductsModule), PlansModule],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule { }
