import { Injectable } from '@nestjs/common';
import { createApi } from 'unsplash-js';

@Injectable()
export class ImageService {
  private unsplash = createApi({
    accessKey: process.env.UNSPLASH_ACCESS_KEY,
  });

  async getRandomImage() {
    const result = await this.unsplash.photos.getRandom({
      count: 1,
      collectionIds: ['mCxOIZM8G8A'],
      topicIds: ['6sMVjTLSkeQ', 'mqgMJzgvG_U'],
      contentFilter: 'low',
    });
    const image = (result.response as any)[0].urls.full;
    return image;
  }
}
