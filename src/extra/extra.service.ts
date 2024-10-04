import { Buttons, CallbackButton, Key, Keyboard, MakeOptions } from 'telegram-keyboard';
import { Message } from 'telegraf/typings/core/types/typegram';
import { Injectable } from '@nestjs/common';

import { IReplyOrEditWithAudioOptions } from '@/interfaces/replies/reply-or-edit-with-audio.interface';

import { IReplyOrEditOptions } from '@/interfaces/replies/reply-or-edit.interface';
import { IReplyAlertOptions } from '@/interfaces/replies/reply-alert.interface';
import { IContext } from '@/interfaces/context.interface';
import { IButton } from '@/interfaces/button.interface';

@Injectable()
export class ExtraService {
     constructor() {}

     public async tryDeleteMessege(ctx: IContext) {
          try {
               const { messageId } = ctx.session;
               await ctx.deleteMessage(messageId ? messageId : undefined);
          } catch (e) {};
     };

     public async replyOrEdit(options: IReplyOrEditOptions, ctx: IContext) {
          const { reply_markup } = options;

          try {
               return (await ctx.editMessageText(options.text, {
                    reply_markup,
                    parse_mode: 'HTML'
               })) as Message.TextMessage;
          } catch (e) {
               return (await ctx.sendMessage(options.text, { reply_markup, parse_mode: 'HTML' })) as Message.TextMessage;
          };
     };

     public async replyOrEditWithAudio(options: IReplyOrEditWithAudioOptions, ctx: IContext) {
          const { reply_markup } = options;

          return (await ctx.sendAudio(
               { url: options.audio, filename: options.filename },
               {
                    caption: options.text,
                    parse_mode: 'HTML',
                    reply_markup,
                    ...reply_markup
               }
          )) as Message.AudioMessage;
     };

     public async replyAlert(ctx: IContext, options: IReplyAlertOptions) {
          return await ctx.answerCbQuery(options.text);
     };

     public typedInlineKeyboard(buttons: any, makeOptions?: Partial<MakeOptions>) {
          return this.typedKeyboard(buttons, makeOptions).inline();
     };

     public typedKeyboard(buttons: any, makeOptions?: Partial<MakeOptions>) {
          const parsedButtons = this.toTypedKeyboard(buttons, makeOptions as MakeOptions);
          return Keyboard.make(parsedButtons as CallbackButton[], makeOptions as MakeOptions);
     };

     public simpleInlineKeyboard(buttons: Buttons, template?: string, makeOptions?: Partial<MakeOptions>) {
          return this.simpleKeyboard(buttons, template, makeOptions).inline();
     };

     public simpleKeyboard(buttons: Buttons, template?: string, makeOptions?: Partial<MakeOptions>) {
          if (template) {
               const buttonsFromFactory = this.factoryCallbackData(buttons, template);
               return Keyboard.make(buttonsFromFactory, makeOptions as MakeOptions);
          }

          return Keyboard.make(buttons, makeOptions as MakeOptions);
     };

     public combineKeyboards(...keyboards: Keyboard[]) {
          return Keyboard.combine(...keyboards);
     };

     public removeKeyboard() {
          return Keyboard.remove();
     };

     private toTypedKeyboard(buttons: Buttons, makeOptions?: MakeOptions) {
          return buttons.flatMap((btn: any | IButton | (string | IButton)[]) => {
               if (typeof btn === 'string') {
                    return this.toCallbackButton({ text: btn });
               }

               if (Array.isArray(btn)) {
                    return btn.map((button) => this.toCallbackButton(typeof button === 'string' ? { text: button } : button));
               }

               return this.toCallbackButton(btn);
          });
     };

     private factoryCallbackData(buttons: Buttons, template?: string) {
          return buttons.map((button: any) => {
               if (typeof button == 'string') {
                    return Key.callback(button, template + button);
               }

               if (Array.isArray(button)) {
                    return button.map((button) => Key.callback(button, template + button));
               }
          }) as CallbackButton[];
     };

     private toCallbackButton(button: IButton): CallbackButton {
          return {
               text: button.text,
               callback_data: button.callback_data || button.text,
               hide: button.hide || false
          };
     };
};