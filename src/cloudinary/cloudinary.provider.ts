import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryConstant } from '@/common/constants/cloudinary.constant';

export const CloudinaryProvider: Provider = {
     provide: CloudinaryConstant.CLOUDINARY,
     useFactory: (config: ConfigService) => {
          cloudinary.config({
               cloud_name: config.get<string>('CLOUDINARY_API_NAME'),
               api_key: config.get<string>('CLOUDINARY_API_KEY'),
               api_secret: config.get<string>('CLOUDINARY_API_SECRET')
          });

          return cloudinary;
     },

     inject: [ConfigService]
};
