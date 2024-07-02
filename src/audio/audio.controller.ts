import { Controller, Get, Query, Res } from '@nestjs/common';
import { AudioService } from './audio.service';
import { Response } from 'express';

@Controller('audio')
export class AudioController {
  constructor(private readonly audioService: AudioService) {}

  @Get()
  async testRoute(@Query('url') url: string, @Res() res: Response) {
    const audioBytes = await this.audioService.getAudioStream(
      decodeURIComponent(url),
    );

    res.set({
      'Content-Type': 'audio/mp3',
      'Content-Disposition': 'inline',
    });

    audioBytes.pipe(res);
  }

  @Get('/fetch')
  async testFetch() {
    const req = fetch('https://www.thunderclient.com/welcome', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return (await req).json();
  }
}
