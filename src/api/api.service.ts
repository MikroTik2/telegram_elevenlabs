import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ElevenLabs, ElevenLabsClient } from 'elevenlabs';

import { catchError, map } from 'rxjs';
import { CloudinaryService } from '@/cloudinary/cloudinary.service';

@Injectable()
export class ApiService {
     constructor(private readonly config: ConfigService, private readonly cloudinary: CloudinaryService, private readonly http: HttpService) {}

     private api_key = this.config.get<string>('ELEVENLABS_API_KEY');
     private elevenlabs = new ElevenLabsClient({ apiKey: this.api_key });

     public async getTextToSpeech(text: string, id: string) {
          try {

               const data = await this.elevenlabs.textToSpeech.convert(id, {
                    optimize_streaming_latency: ElevenLabs.OptimizeStreamingLatency.Zero,
                    model_id: 'eleven_multilingual_v2',
                    text,
                    voice_settings: {
                         stability: 0.1,
                         similarity_boost: 0.3,
                         style: 0.2
                    }
               });
     
               const audioChunks: Uint8Array[] = [];
     
               for await (const chunk of data) {
                    audioChunks.push(chunk);
               };
     
               const audio = await this.cloudinary.uploadAudio(`data:audio/mp3;base64,${Buffer.concat(audioChunks).toString('base64')}`);
     
               return audio;

          } catch (error) {
               throw new Error(`Failed to get text speech from ElevenLabs: ${error.message}`);
          };
     };

     public async getSpeechToSpeech(file: string, id: string) {
          try {
               const response = await this.http.get<ArrayBuffer>(file, { responseType: 'arraybuffer' }).pipe(
                    map((response) => response.data),
                    catchError((error) => {
                         throw new Error(`Could not get the file for voicing from ElevenLabs: ${error.message}`);
                    }),
               ).toPromise();

               const audio_stream = new File([response], 'audio.mp3', { type: 'audio/mpeg' });
               const data = await this.elevenlabs.speechToSpeech.convertAsStream(id, { audio: audio_stream });

               const audioChunks: Uint8Array[] = [];

               for await (const chunk of data) {
                    audioChunks.push(chunk);
               };

               const audio = await this.cloudinary.uploadAudio(`data:audio/mp3;base64,${Buffer.concat(audioChunks).toString('base64')}`);
               return audio;

          } catch (error) {
               throw new Error(`Failed to get audio speech from ElevenLabs: ${error.message}`);
          };
     };

     public async getAudioIsolation(file: string) {
          try {
               const response = await this.http.get<ArrayBuffer>(file, { responseType: 'arraybuffer' }).pipe(
                    map((response) => response.data),
                    catchError((error) => {
                         throw new Error(`Could not get the file for voicing from ElevenLabs: ${error.message}`);
                    })
               ).toPromise();

               const audio_stream = new File([response], 'audio.mp3', { type: 'audio/mpeg' });
               const data = await this.elevenlabs.audioIsolation.audioIsolationStream({ audio: audio_stream });

               const audioChunks: Uint8Array[] = [];

               for await (const chunk of data) {
                    audioChunks.push(chunk);
               };

               const audio = await this.cloudinary.uploadAudio(`data:audio/mp3;base64,${Buffer.concat(audioChunks).toString('base64')}`);
               return audio;

          } catch (error) {
               throw new Error(`Failed to get audio isolation from ElevenLabs: ${error.message}`);
          };
     };

     public async getAudioEffects(text: string) {
          try {

               const data = await this.elevenlabs.textToSoundEffects.convert({
                    text,
                    duration_seconds: 120,
                    prompt_influence: 0.3
               });
     
               const audioChunks: Uint8Array[] = [];
     
               for await (const chunk of data) {
                    audioChunks.push(chunk);
               };
     
               const audio = await this.cloudinary.uploadAudio(`data:audio/mp3;base64,${Buffer.concat(audioChunks).toString('base64')}`);
               return audio;

          } catch (error) {
               throw new Error(`Failed to get audio effects from ElevenLabs: ${error.message}`);
          };
     };

     public async getVoices() {
          try {
               const data = await this.elevenlabs.voices.getAll();
               return data;
          } catch (error) {
               throw new Error(`Failed to get voices from ElevenLabs: ${error.message}`);
          };
     };

     public async getVoiceId(id: string) {
          try {
               const data = await this.elevenlabs.voices.get(id);
               return data;
          } catch (error) {
               throw new Error(`Failed to get voice id from ElevenLabs: ${error.message}`);
          };
     };
};