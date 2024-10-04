import { Module } from '@nestjs/common';

import { TelegrafModule } from 'nestjs-telegraf';
import { GreeterModule } from '@/greeter/greeter.module';

import { options } from '@/telegram/telegram-config.factory';
import { ExtraModule } from '@/extra/extra.module';
import { TelegramConstant } from '@/common/constants/telegram.constant';
import { TelegramService } from '@/telegram/telegram.service';

@Module({
     imports: [
          TelegrafModule.forRootAsync({
               botName: TelegramConstant.NAME,
               ...options()
          }),

          ExtraModule,
          GreeterModule
     ],

     providers: [TelegramService],
})

export class TelegramModule {};