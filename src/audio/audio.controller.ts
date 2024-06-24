import { Controller, Get, Res } from '@nestjs/common';
import { AudioService } from './audio.service';
import { Response } from 'express';

@Controller('audio')
export class AudioController {
  constructor(private readonly audioService: AudioService) {}

  @Get()
  async testRoute(@Res() res: Response) {
    const audioBytes = await this.audioService.getAudioStream();
    res.set({
      'Content-Type': 'audio/mp3',
      'Content-Disposition': 'inline',
    });

    audioBytes.pipe(res);
  }
}
