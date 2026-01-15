import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles, UseGuards, Request } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() createProductDto: CreateProductDto, @Request() req) {
        return this.productsService.create(createProductDto, req.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Post(':id/upload')
    @UseInterceptors(FilesInterceptor('files', 10, {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
                const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                return cb(null, `${randomName}${extname(file.originalname)}`);
            }
        })
    }))
    async uploadImages(@Param('id') id: string, @UploadedFiles() files: Array<Express.Multer.File>) {
        if (!files || files.length === 0) throw new Error('No files found');

        const product = await this.productsService.findOne(id);
        if (!product) {
            throw new Error('Product not found');
        }
        if (!product.images) product.images = [];

        files.forEach(file => {
            const imageUrl = `/uploads/${file.filename}`;
            product.images.push(imageUrl);
        });

        return this.productsService.update(id, { images: product.images });
    }

    @UseGuards(JwtAuthGuard)
    @Post(':id/upload-doc')
    @UseInterceptors(FilesInterceptor('files', 10, {
        storage: diskStorage({
            destination: './uploads/docs',
            filename: (req, file, cb) => {
                const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                return cb(null, `${randomName}${extname(file.originalname)}`);
            }
        })
    }))
    async uploadDocuments(@Param('id') id: string, @UploadedFiles() files: Array<Express.Multer.File>) {
        if (!files || files.length === 0) throw new Error('No files found');

        const product = await this.productsService.findOne(id);
        if (!product) throw new Error('Product not found');

        if (!product.documents) product.documents = [];

        files.forEach(file => {
            const docUrl = `/uploads/docs/${file.filename}`;
            product.documents.push({
                name: file.originalname,
                url: docUrl,
                type: file.mimetype,
                date: new Date().toISOString()
            });
        });

        return this.productsService.update(id, { documents: product.documents });
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    findAll(@Request() req) {
        return this.productsService.findAll(req.user.userId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.productsService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
        return this.productsService.update(id, updateProductDto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.productsService.remove(id);
    }
}
