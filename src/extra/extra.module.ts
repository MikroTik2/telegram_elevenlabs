import { Module } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';
import { ExtraService } from '@/extra/extra.service';

import { ApiModule } from '@/api/api.module';

import { HomeScene } from '@/greeter/scenes/home.scene';
import { HelpScene } from '@/greeter/scenes/help.scene';
import { TextScene } from '@/greeter/scenes/text.scene';
import { HistoryScene } from '@/greeter/scenes/history.scene';
import { SpeechScene } from '@/greeter/scenes/speech.scene';
import { EffectsScene } from '@/greeter/scenes/effects.scene';
import { IsolationScene } from '@/greeter/scenes/isolation.scene';
import { CloudinaryModule } from '@/cloudinary/cloudinary.module';

@Module({
     imports: [ApiModule, CloudinaryModule],
     providers: [PrismaService, ExtraService, HistoryScene, EffectsScene, TextScene, SpeechScene, HomeScene, IsolationScene, HelpScene],
     exports: [ExtraService],
})

export class ExtraModule {};