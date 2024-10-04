import { BadRequestException, Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

interface ICloudinaryOptions {
     folder: string;
     format: 'mp3' | 'auto' | 'mp4';
     resource_type: 'auto' | 'image' | 'video' | 'raw';
}

@Injectable()
export class CloudinaryService {
     private async uplaodFile(file: string, options: ICloudinaryOptions): Promise<UploadApiResponse | UploadApiErrorResponse> {
          try {
               return await cloudinary.uploader.upload(file, options);
          } catch (error) {
               throw new BadRequestException(`Failed to upload file from Cloudinary: ${error.message}`);
          };
     };

     public async destroyFile(id: string): Promise<UploadApiResponse | UploadApiErrorResponse> {
          try {
               return await cloudinary.uploader.destroy(id, { resource_type: 'raw' });
          } catch (error) {
               throw new BadRequestException(`Failed to destroy file from Cloudinary: ${error.message}`);
          };
     };

     public async uploadAudio(audio: string): Promise<UploadApiResponse | UploadApiErrorResponse> {
          return await this.uplaodFile(audio, {
               folder: 'audio',
               format: 'mp3',
               resource_type: 'raw',
          });
     };
};