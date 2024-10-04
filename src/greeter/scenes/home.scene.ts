import { Scene, SceneEnter } from 'nestjs-telegraf';
import { PrismaService } from '@/prisma/prisma.service';
import { Files, User } from '@prisma/client';

import { ExtraService } from '@/extra/extra.service';

import { IContext } from '@/interfaces/context.interface';

@Scene('HOME_SCENE_ID')
export class HomeScene {
     constructor(private readonly prisma: PrismaService, private readonly extra: ExtraService) {};

     @SceneEnter()
     async start(ctx: IContext) {
          const { message_id } = await this.extra.replyOrEdit(
               {
                    text: `I'm a bot created with <b>ElevenLabs</b> and I can convert your text into <b>realistic</b> audio 🎧. Just send me the text and I will voice it for you. Try it, it's easy and convenient! 😊`,
                    ...this.extra.typedInlineKeyboard(
                         [
                              [
                                   { text: 'Text to speech', callback_data: '/text' },
                                   { text: 'Speech to speech', callback_data: '/speech' }
                              ],
                              [
                                   { text: 'Sound effects', callback_data: '/effects' },
                                   { text: 'Audio isolation', callback_data: '/isolation' },
                                   { text: 'History', callback_data: '/history' }
                              ]
                         ],
                         { columns: 2 },
                    ),
               },
               ctx
          );

          ctx.session.messageId = message_id;

          let user: User = await this.prisma.user.findUnique({
               where: { telegram_id: ctx.from.id.toString() }
          });

          if (!user) {
               user = await this.prisma.user.create({
                    data: {
                         telegram_id: ctx.from.id.toString(),
                         first_name: ctx.from.first_name,
                         last_name: ctx.from.last_name || '',
                         language_code: ctx.from.language_code,
                         username: ctx.from.username,
                         data: [] as Files[],
                    },
               });
          };
     };
};