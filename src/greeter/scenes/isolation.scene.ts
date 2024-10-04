import { Ctx, Message, On, Scene, SceneEnter } from 'nestjs-telegraf';
import { PrismaService } from '@/prisma/prisma.service';

import { ExtraService } from '@/extra/extra.service';

import { IContext } from '@/interfaces/context.interface';
import { ApiService } from '@/api/api.service';
import { IMessage } from '@/interfaces/message.interface';
import { IVoice } from '@/interfaces/voice.interface';
import { IVideo } from '@/interfaces/video.interface';

@Scene('ISOLATION_SCENE_ID')
export class IsolationScene {
     constructor(private readonly prisma: PrismaService, private readonly api: ApiService, private readonly extra: ExtraService) {}

     @SceneEnter()
     async isolation(ctx: IContext) {
          this.extra.tryDeleteMessege(ctx);

          await this.extra.replyOrEdit(
               {
                    text: '<b>Removes background noise from audio</b> \n\nOur advanced AI technology effectively analyzes your file to identify and eliminate unwanted sounds, ensuring your main audio content is clear and professional. Simply upload your file, and let us enhance your audio quality for a more polished listening experience. \n\nEnter the video or audio from which we will remove the noise. '
               },
               ctx,
          );
     };

     @On('audio')
     async getAudio(@Ctx() ctx: IContext, @Message() message: IMessage, @Message('audio') audio: IVoice) {
          const file = await ctx.telegram.getFileLink(audio.file_id);

          switch (message.text) {
               case '/start':
                    await ctx.scene.enter('HOME_SCENE_ID');
                    return;

               case '/help':
                    await ctx.scene.enter('HELP_SCENE_ID');
                    return;
          };

          const { message_id } = await this.extra.replyOrEdit({ text: '<code>Message received. Waiting for a response from the server!</code>' }, ctx);
          ctx.session.messageId = message_id;

          const api = await this.api.getAudioIsolation(file.href);

          await this.extra.replyOrEditWithAudio(
               {
                    audio: api.secure_url,
                    filename: api.public_id
               },
               ctx,
          );

          await this.extra.tryDeleteMessege(ctx);

          await this.prisma.user.update({
               where: { telegram_id: ctx.from.id.toString() },
               data: {
                    data: {
                         push: {
                              category: 'audio_isolation',
                              filename: api.public_id,
                              file: api.secure_url,
                              text: 'Not Found',
                         },
                    },
               },
          });
     };

     @On('video')
     async getVideo(@Ctx() ctx: IContext, @Message() message: IMessage, @Message('video') video: IVideo) {
          const file = await ctx.telegram.getFileLink(video.file_id);

          switch (message.text) {
               case '/start':
                    await ctx.scene.enter('HOME_SCENE_ID');
                    return;

               case '/help':
                    await ctx.scene.enter('HELP_SCENE_ID');
                    return;
          };

          const { message_id } = await this.extra.replyOrEdit({ text: '<code>Message received. Waiting for a response from the server!</code>' }, ctx);
          ctx.session.messageId = message_id;
          const api = await this.api.getAudioIsolation(file.href);

          await this.extra.replyOrEditWithAudio(
               {
                    audio: api.secure_url,
                    filename: api.public_id
               },
               ctx,
          );

          await this.extra.tryDeleteMessege(ctx);

          await this.prisma.user.update({
               where: { telegram_id: ctx.from.id.toString() },
               data: {
                    data: {
                         push: {
                              category: 'audio_isolation',
                              filename: api.public_id,
                              file: api.secure_url,
                              text: 'Not Found',
                         },
                    },
               },
          });
     };
};