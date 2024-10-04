import { IReplyOrEditOptions } from '@/interfaces/replies/reply-or-edit.interface';

export interface IReplyOrEditWithAudioOptions extends IReplyOrEditOptions {
     audio: string;
     filename: string;
};