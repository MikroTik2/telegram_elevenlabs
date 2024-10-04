import { Scene, Action, SceneEnter } from 'nestjs-telegraf';
import { PrismaService } from '@/prisma/prisma.service';

import { ExtraService } from '@/extra/extra.service';

import { IContext } from '@/interfaces/context.interface';
import { CloudinaryService } from '@/cloudinary/cloudinary.service';

@Scene('HISTORY_SCENE_ID')
export class HistoryScene {
     constructor(private readonly prisma: PrismaService, private readonly extra: ExtraService, private readonly cloudinary: CloudinaryService) {};

     @SceneEnter()
     async history(ctx: IContext) {
          const user = await this.prisma.user.findUnique({
               where: { telegram_id: ctx.from.id.toString() },
               select: {
                    data: true,
               },
          });

          if (!user || user.data.length === 0) {
               await this.extra.replyAlert(ctx, { text: 'No audio data found.' });
               return;
          };

          this.extra.tryDeleteMessege(ctx);

          user.data.map((items) => {
               this.extra.replyOrEditWithAudio(
                    {
                         text: `\n<b>Text:</b> <code>${items.text}</code>\n<b>Category:</b> <code>${items.category}</code>`,
                         filename: items.filename,
                         audio: items.file,
                         ...this.extra.typedInlineKeyboard([{ text: 'Delete', callback_data: `delete_${items.filename}` }]),
                    },
                    ctx,
               );
          });
     };

     @Action(/delete_(.+)/)
     async deleteAudio(ctx: IContext) {
          const filename = ctx.callbackQuery?.['data'].split('_')[1];

          const user = await this.prisma.user.findUnique({
               where: { telegram_id: ctx.from.id.toString() },
               select: { data: true }
          });

          await this.cloudinary.destroyFile(filename);

          const data = user.data.filter((item) => item.filename !== filename);

          await this.prisma.user.update({
               where: { telegram_id: ctx.from.id.toString() },
               data: { data: data },
          });

          await this.extra.replyAlert(ctx, { text: 'Audio deleted successfully.' });
     };
};