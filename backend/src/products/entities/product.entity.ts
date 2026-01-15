import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Store } from '../../stores/entities/store.entity';

export enum ProductCondition {
    NEW = 'Novo',
    USED = 'Usado',
    OPEN_BOX = 'Open Box'
}

@Entity()
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    brand: string;

    @Column({ nullable: true })
    model: string;

    @Column({ nullable: true })
    category: string;

    @Column({
        type: 'simple-enum',
        enum: ProductCondition,
        default: ProductCondition.NEW
    })
    condition: ProductCondition;

    @Column('decimal', { precision: 12, scale: 2 })
    price: number;

    @Column('decimal', { precision: 12, scale: 2, nullable: true, default: 0 })
    costPrice: number;

    @Column('int', { default: 1 })
    stock: number;

    @Column('text')
    description: string;

    @Column('simple-json', { nullable: true })
    specs: Record<string, string>;

    @Column('simple-json', { nullable: true })
    images: string[];

    @Column('simple-json', { nullable: true })
    documents: { name: string; url: string; type: string; date: string }[];

    @Column({ default: 0 })
    views: number;

    @Column({ default: 0 })
    interestCount: number;

    @ManyToOne(() => Store)
    store: Store;

    @Column({ nullable: true })
    userId: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
