import { InjectBot } from 'nestjs-telegraf';
import { Injectable } from '@nestjs/common';

import { InlineKeyboardMarkup, ReplyKeyboardMarkup } from 'telegraf/typings/core/types/typegram';
import { TelegramConstant } from '@/common/constants/telegram.constant';

import { ITelegramContext } from '@/interfaces/context-bot.interface';
import { IContext } from '@/interfaces/context.interface';

@Injectable()
export class TelegramService {
     constructor(@InjectBot(TelegramConstant.NAME) private readonly bot: ITelegramContext) {}

     async sendMessage(ctx: IContext, text: string, keyboard: { reply_markup: ReplyKeyboardMarkup | InlineKeyboardMarkup }) {
          const { id: chatId } = ctx.chat;

          await this.bot.telegram.sendMessage(chatId, text, {
               parse_mode: 'HTML',
               ...keyboard,
          });
     };
};