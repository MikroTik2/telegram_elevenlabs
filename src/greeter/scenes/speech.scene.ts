import { Action, Ctx, Message, On, Scene, SceneEnter } from 'nestjs-telegraf';

import { ExtraService } from '@/extra/extra.service';

import { IContext } from '@/interfaces/context.interface';
import { ApiService } from '@/api/api.service';
import { IMessage } from '@/interfaces/message.interface';
import { PrismaService } from '@/prisma/prisma.service';
import { IVoice } from '@/interfaces/voice.interface';

@Scene('SPEECH_SCENE_ID')
export class SpeechScene {
     constructor(private readonly api: ApiService, private readonly extra: ExtraService, private readonly prisma: PrismaService) {}

     @SceneEnter()
     async geAllVoices(ctx: IContext) {
          const api = await this.api.getVoices();

          const inlineKeyboard = api.voices.map((voice: any) => [
               {
                    text: voice.name,
                    callback_data: voice.voice_id.toString()
               },
          ]);

          await this.extra.replyOrEdit(
               {
                    text: 'Choose a <b>voice</b> from the list below:',
                    ...this.extra.typedInlineKeyboard(inlineKeyboard, { columns: 4 })
               },
               ctx
          );
     };

     @Action(/^[a-zA-Z0-9]{20}$/)
     async getVoicesId(ctx: IContext) {
          const id = ctx.callbackQuery?.['data'];
          const api = await this.api.getVoiceId(id);

          const info = `
               \n<b>Voice ID</b>: <code>${api.voice_id}</code>\n<b>Name:</b> <code>${api.name}</code>\n<b>Category:</b> <code>${
               api.category || 'Unspecified'
          }</code>\n<b>Description:</b> <code>${api.description || 'No description'}</code>\n<b>Accent:</b> <code>${api.labels.accent}</code>\n<b>Gender:</b> <code>${
               api.labels.gender
          }</code>
          `;

          ctx.session.voiceId = api.voice_id;

          await this.extra.replyOrEditWithAudio(
               {
                    audio: api.preview_url,
                    filename: api.name,
                    text: `${info}\nEnter the <b>audio</b> that will be <b>voiced</b> by that voice.`
               },
               ctx
          );
     }

     @On('voice')
     async getAudio(@Ctx() ctx: IContext, @Message() message: IMessage, @Message('voice') voice: IVoice) {
          const file = await ctx.telegram.getFileLink(voice.file_id);

          switch (message.text) {
               case '/start':
                    await ctx.scene.enter('HOME_SCENE_ID');
                    return;

               case '/help':
                    await ctx.scene.enter('HELP_SCENE_ID');
                    return;
          }

          if (ctx.session.voiceId === undefined) {
               await this.extra.replyOrEdit({ text: `Unfortunately, we could not detect the selected voice. Please make sure you have selected a voice before continuing.` }, ctx);
               return;
          };

          const { message_id } = await this.extra.replyOrEdit({ text: '<code>Message received. Waiting for a response from the server!</code>' }, ctx);
          ctx.session.messageId = message_id;

          const api = await this.api.getSpeechToSpeech(file.href, ctx.session.voiceId);

          await this.extra.replyOrEditWithAudio(
               {
                    audio: api.secure_url,
                    filename: api.public_id,
               },
               ctx
          );

          await this.extra.tryDeleteMessege(ctx);

          await this.prisma.user.update({
               where: { telegram_id: ctx.from.id.toString() },
               data: {
                    data: {
                         push: {
                              category: 'speech_to_speech',
                              filename: api.public_id,
                              file: api.secure_url,
                              text: 'Not Found',
                         },
                    },
               },
          });
     };
};