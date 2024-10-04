import { Context as BaseContext, Scenes as TelegrafScenes } from 'telegraf';
import { CallbackQuery, Message, Update } from 'telegraf/typings/core/types/typegram';
import { ICreateEntity } from './create.interface';
import { SceneContextScene } from 'telegraf/typings/scenes';

export interface IContext extends BaseContext {
     update: Update.CallbackQueryUpdate & { message: Message.PhotoMessage };
     session: SessionData;
     scene: ISceneContextScene;
     message: Update.New & Update.NonChannel & Message & { text?: string };
     callbackQuery: CallbackQuery & { data: string };
};

interface ISceneContextScene extends SceneContextScene<IContext, SceneSession> {
     enter: (sceneId: any) => Promise<unknown>;
};

interface SessionData extends TelegrafScenes.SceneSession<SceneSession> {
     creation?: ICreateEntity;
     image?: string;
     voiceId: string;
     messageId?: number;
};

interface SceneSession extends TelegrafScenes.SceneSessionData {
     state: {
          token?: string;
     };
};