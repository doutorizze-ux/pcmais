import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UsersService } from '../users/users.service';
import { PlansService } from '../plans/plans.service';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private productsRepository: Repository<Product>,
        private usersService: UsersService,
        private plansService: PlansService,
    ) { }

    async create(createProductDto: CreateProductDto, userId?: string) {
        if (userId) {
            const user = await this.usersService.findById(userId);
            if (user && user.planId) {
                const plan = await this.plansService.findOne(user.planId);

                // Use vehicleLimit as productLimit
                if (plan && plan.vehicleLimit !== null && plan.vehicleLimit !== undefined) {
                    if (plan.vehicleLimit > 0) {
                        const currentCount = await this.productsRepository.count({ where: { userId } });
                        if (currentCount >= plan.vehicleLimit) {
                            throw new BadRequestException(`Limite de produtos do plano ${plan.name} atingido (${plan.vehicleLimit} produtos). Faça um upgrade para adicionar mais.`);
                        }
                    }
                }
            }
        }

        return this.productsRepository.save({ ...createProductDto, userId });
    }

    findAll(userId?: string) {
        if (userId) {
            return this.productsRepository.find({ where: { userId }, order: { createdAt: 'DESC' } });
        }
        return this.productsRepository.find({ order: { createdAt: 'DESC' } });
    }

    findOne(id: string) {
        return this.productsRepository.findOne({ where: { id } });
    }

    update(id: string, updateProductDto: UpdateProductDto) {
        return this.productsRepository.update(id, updateProductDto);
    }

    remove(id: string) {
        return this.productsRepository.delete(id);
    }
}
