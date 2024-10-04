import { TelegrafModuleOptions, TelegrafModuleAsyncOptions } from 'nestjs-telegraf';
import { sessionMiddleware } from '@/middleware/session.middleware';
import { ConfigService } from '@nestjs/config';
import { GreeterModule } from '@/greeter/greeter.module';
import { ExtraModule } from '@/extra/extra.module';

const telegramModuleOptions = (config: ConfigService): TelegrafModuleOptions => {
     return {
          token: config.get<string>('TELEGRAM_BOT_TOKEN'),
          middlewares: [sessionMiddleware],
          include: [GreeterModule, ExtraModule],
     };
};

export const options = (): TelegrafModuleAsyncOptions => {
     return {
          useFactory: (config: ConfigService) => telegramModuleOptions(config),
          inject: [ConfigService],
     };
};
