import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { Readable } from 'stream';

const TEST_LINK =
  'https://download.quranicaudio.com/qdc/abdul_baset/mujawwad/2.mp3';
@Injectable()
export class AudioService {
  async getAudioStream(): Promise<Readable> {
    try {
      const response = await axios.get(TEST_LINK, {
        responseType: 'stream',
      });
      Logger.log('STREAM STARTED');
      return response.data;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch audio data',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
