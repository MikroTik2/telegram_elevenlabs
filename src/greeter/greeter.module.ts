import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { GreeterUpdate } from '@/greeter/greeter.update';
import { ExtraModule } from '@/extra/extra.module';
import { SessionModule } from '@/session/session.module';

@Module({
     imports: [ConfigModule.forRoot(), ExtraModule, TelegrafModule, SessionModule],
     providers: [
          {
               provide: 'greeterBot',
               useFactory: (configService: ConfigService) => {
                    const bot = new Telegraf(configService.get<string>('TELEGRAM_BOT_TOKEN'));
                    return bot;
               },

               inject: [ConfigService],
          },

          GreeterUpdate,
     ],
     exports: ['greeterBot'],
})

export class GreeterModule {};
