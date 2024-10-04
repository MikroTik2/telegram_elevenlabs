import { Scene, SceneEnter } from 'nestjs-telegraf';
import { ExtraService } from '@/extra/extra.service';

import { IContext } from '@/interfaces/context.interface';

@Scene('HELP_SCENE_ID')
export class HelpScene {
     constructor(private readonly extra: ExtraService) {};

     @SceneEnter()
     async help(ctx: IContext) {
          await this.extra.replyOrEdit({ text: `⁉️<b>If you have any problems.</b> \n✉️ <b>Write to me</b> <a href='https://t.me/d16ddd348'>@d16ddd348</a><b>.</b>` }, ctx);
     };
};