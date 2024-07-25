import { Test, TestingModule } from '@nestjs/testing';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';

describe('ImageController', () => {
  let controller: ImageController;
  let service: ImageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImageController],
      providers: [
        {
          provide: ImageService,
          useValue: {
            getRandomImage: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ImageController>(ImageController);
    service = module.get<ImageService>(ImageService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getRandomImage', () => {
    it('should return a random image URL', async () => {
      const expectedImageUrl = 'https://example.com/random-image.jpg';
      jest.spyOn(service, 'getRandomImage').mockResolvedValue(expectedImageUrl);

      const result = await controller.getRandomImage();

      expect(result).toBe(expectedImageUrl);
      expect(service.getRandomImage).toHaveBeenCalled();
    });
  });
});
