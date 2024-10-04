import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TelegramModule } from '@/telegram/telegram.module';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
     imports: [
          ConfigModule.forRoot({
               isGlobal: true,
          }),

          PrismaModule,
          TelegramModule,
     ],
})

export class AppModule {};