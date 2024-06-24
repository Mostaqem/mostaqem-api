import { BadRequestException, Injectable, Logger } from '@nestjs/common';
// import axios from 'axios';
import { createReadStream } from 'node:fs';
import * as path from 'node:path';
import { Readable } from 'stream';

const TEST_LINK =
  'https://download.quranicaudio.com/qdc/abdul_baset/mujawwad/2.mp3';
@Injectable()
export class AudioService {
  async getAudioStream(): Promise<Readable> {
    try {
      Logger.log('STREAM STARTED');

      const readStream = createReadStream(
        path.join(__dirname, '..', '..', 'assets', '1.mp3'),
      );
      //buffer
      // const buffer = fs.readFileSync(
      //   path.join(__dirname, '..', '..', 'assets', '2.mp3'),
      // );
      Logger.log('STREAM END');
      return readStream;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
