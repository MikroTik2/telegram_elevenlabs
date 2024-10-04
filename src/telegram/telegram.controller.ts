import { Controller } from '@nestjs/common';
import { TelegramService } from '@/telegram/telegram.service';

@Controller()
export class TelegramController {
     constructor(private readonly telegram: TelegramService) {};
};