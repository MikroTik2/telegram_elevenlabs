import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { TelegrafArgumentsHost } from 'nestjs-telegraf';
import { IContext } from '@/interfaces/context.interface';

@Catch()
export class TelegrafExceptionFilter implements ExceptionFilter {
     async catch(exception: Error, host: ArgumentsHost): Promise<void> {
          const telegramHost = TelegrafArgumentsHost.create(host);
          const ctx = telegramHost.getContext<IContext>();

          await ctx.replyWithHTML(`<b>Sorry, but something went wrong</b>: <code>${exception.message}</code>`);
     }
}
