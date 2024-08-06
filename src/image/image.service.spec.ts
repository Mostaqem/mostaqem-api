import { Test, TestingModule } from '@nestjs/testing';
import { ImageService } from './image.service';
import { createApi } from 'unsplash-js';

jest.mock('unsplash-js');

describe('ImageService', () => {
  let service: ImageService;
  let mockUnsplash: any;

  beforeEach(async () => {
    mockUnsplash = {
      photos: {
        getRandom: jest.fn(),
      },
    };

    (createApi as jest.Mock).mockReturnValue(mockUnsplash);

    const module: TestingModule = await Test.createTestingModule({
      providers: [ImageService],
    }).compile();

    service = module.get<ImageService>(ImageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getRandomImage', () => {
    it('should return a random image URL', async () => {
      const mockResponse = {
        response: [
          {
            urls: {
              full: 'https://example.com/random-image.jpg',
            },
          },
        ],
      };

      mockUnsplash.photos.getRandom.mockResolvedValue(mockResponse);

      const result = await service.getRandomImage();

      expect(result).toBe('https://example.com/random-image.jpg');
      expect(mockUnsplash.photos.getRandom).toHaveBeenCalledWith({
        count: 1,
        collectionIds: ['mCxOIZM8G8A'],
        topicIds: ['6sMVjTLSkeQ', 'mqgMJzgvG_U'],
        contentFilter: 'low',
      });
    });
  });
});
