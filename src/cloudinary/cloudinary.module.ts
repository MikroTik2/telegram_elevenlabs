import { Module } from '@nestjs/common';
import { CloudinaryService } from '@/cloudinary/cloudinary.service';
import { CloudinaryProvider } from './cloudinary.provider';

@Module({
     providers: [CloudinaryProvider, CloudinaryService],
     exports: [CloudinaryProvider, CloudinaryService],
})

export class CloudinaryModule {};