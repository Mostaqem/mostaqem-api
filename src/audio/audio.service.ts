import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
// import axios from 'axios';
import { Readable } from 'stream';

@Injectable()
export class AudioService {
  async getAudioStream(url: string): Promise<Readable> {
    try {
      Logger.log('STREAM STARTED');

      const response = await axios.get(url, {
        responseType: 'stream',
        maxRedirects: 5,
      });

      Logger.log('STREAM END');
      return response.data;
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error);
    }
  }
}
