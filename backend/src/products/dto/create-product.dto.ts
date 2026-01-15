import { ProductCondition } from '../entities/product.entity';

export class CreateProductDto {
    name: string;
    brand: string;
    model?: string;
    category?: string;
    condition?: ProductCondition;
    price: number;
    costPrice?: number;
    stock?: number;
    description: string;
    specs?: Record<string, string>;
    images?: string[];
    documents?: { name: string; url: string; type: string; date: string }[];
}
