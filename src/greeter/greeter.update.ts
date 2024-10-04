import { Action, Ctx, Help, Start, Update } from 'nestjs-telegraf';
import { Logger, UseFilters } from '@nestjs/common';

import { TelegrafExceptionFilter } from '@/common/filters/telegraf-exception.filter';
import { IContext } from '@/interfaces/context.interface';
import { SessionService } from '@/session/session.service';

@Update()
@UseFilters(TelegrafExceptionFilter)
export class GreeterUpdate {
     constructor(private readonly session: SessionService) {}

     @Start()
     async onStart(ctx: IContext) {
          this.session.resetBotSession(ctx);
          Logger.verbose(ctx.session, `SESSION - START`);

          await ctx.scene.enter('HOME_SCENE_ID');
     };

     @Help()
     async onHelp(@Ctx() ctx: IContext) {
          await ctx.scene.enter('HELP_SCENE_ID');
     };

     @Action('/text')
     async onText(@Ctx() ctx: IContext) {
          await ctx.scene.enter('TEXT_SCENE_ID');
     };

     @Action('/speech')
     async onSpeech(@Ctx() ctx: IContext) {
          await ctx.scene.enter('SPEECH_SCENE_ID');
     };

     @Action('/effects')
     async onEffects(@Ctx() ctx: IContext) {
          await ctx.scene.enter('EFFECTS_SCENE_ID');
     };

     @Action('/isolation')
     async onIsolation(@Ctx() ctx: IContext) {
          await ctx.scene.enter('ISOLATION_SCENE_ID');
     };

     @Action('/history')
     async onHistory(@Ctx() ctx: IContext) {
          await ctx.scene.enter('HISTORY_SCENE_ID');
     };
};