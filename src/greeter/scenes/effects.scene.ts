import { Ctx, Message, On, Scene, SceneEnter } from 'nestjs-telegraf';
import { PrismaService } from '@/prisma/prisma.service';

import { ExtraService } from '@/extra/extra.service';

import { IContext } from '@/interfaces/context.interface';
import { ApiService } from '@/api/api.service';
import { IMessage } from '@/interfaces/message.interface';

@Scene('EFFECTS_SCENE_ID')
export class EffectsScene {
     constructor(private readonly prisma: PrismaService, private readonly api: ApiService, private readonly extra: ExtraService) {};

     @SceneEnter()
     async effects(ctx: IContext) {
          await this.extra.tryDeleteMessege(ctx);

          this.extra.replyOrEdit(
               {
                    text: `Converts text into sounds & uses the most advanced AI audio model ever. Create sound effects for your <b>videos</b>, <b>voice-overs</b> or <b>video games</b>. \n\nEnter the text that will be voiced by that voice.`
               },
               ctx,
          );
     };

     @On('text')
     async onText(@Ctx() ctx: IContext, @Message() message: IMessage) {
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

          const api = await this.api.getAudioEffects(message.text);

          await this.extra.replyOrEditWithAudio(
               {
                    audio: api.secure_url,
                    filename: `${api.public_id}`
               },
               ctx,
          );

          await this.extra.tryDeleteMessege(ctx);

          await this.prisma.user.update({
               where: { telegram_id: ctx.from.id.toString() },
               data: {
                    data: {
                         push: {
                              category: 'audio_effects',
                              filename: `${api.public_id}`,
                              file: api.secure_url,
                              text: 'Not Found',
                         },
                    },
               },
          });
     };
};