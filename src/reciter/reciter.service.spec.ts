import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReciterService } from './reciter.service';
import { Reciter } from './entities/reciter.entity';
import { CreateReciterDto } from './dto/create-reciter.dto';
import { NotFoundException } from '@nestjs/common';

describe('ReciterService', () => {
  let service: ReciterService;
  let repository: Repository<Reciter>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReciterService,
        {
          provide: getRepositoryToken(Reciter),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<ReciterService>(ReciterService);
    repository = module.get<Repository<Reciter>>(getRepositoryToken(Reciter));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new reciter', async () => {
      const createReciterDto: CreateReciterDto = {
        id: 1,
        name_english: 'John Doe',
        name_arabic: 'جون دو',
        image: 'http://example.com/image.jpg',
      };
      const reciter = { id: 1, ...createReciterDto };

      jest.spyOn(repository, 'create').mockReturnValue(reciter as Reciter);
      jest.spyOn(repository, 'save').mockResolvedValue(reciter as Reciter);

      expect(await service.create(createReciterDto)).toEqual(reciter);
      expect(repository.create).toHaveBeenCalledWith(createReciterDto);
      expect(repository.save).toHaveBeenCalledWith(reciter);
    });
  });

  describe('findAll', () => {
    it('should return all reciters ordered by name_english', async () => {
      const reciters = [
        { id: 1, name_english: 'John Doe', name_arabic: 'جون دو' },
        { id: 2, name_english: 'Jane Doe', name_arabic: 'جين دو' },
      ];

      jest.spyOn(repository, 'find').mockResolvedValue(reciters as Reciter[]);

      expect(await service.findAll('eng')).toEqual(reciters);
      expect(repository.find).toHaveBeenCalledWith({ order: { name_english: 'ASC' } });
    });

    it('should return all reciters ordered by name_arabic', async () => {
      const reciters = [
        { id: 1, name_english: 'John Doe', name_arabic: 'جون دو' },
        { id: 2, name_english: 'Jane Doe', name_arabic: 'جين دو' },
      ];

      jest.spyOn(repository, 'find').mockResolvedValue(reciters as Reciter[]);

      expect(await service.findAll('ar')).toEqual(reciters);
      expect(repository.find).toHaveBeenCalledWith({ order: { name_arabic: 'ASC' } });
    });
  });

  describe('findOne', () => {
    it('should return a single reciter', async () => {
      const reciter = { id: 1, name_english: 'John Doe', name_arabic: 'جون دو' };

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(reciter as Reciter);

      expect(await service.findOne(1)).toEqual(reciter);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw NotFoundException if reciter is not found', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateReciterImage', () => {
    it('should update reciter image', async () => {
      const reciter = { id: 1, name_english: 'John Doe', name_arabic: 'جون دو', image: 'old-image.jpg' };
      const updatedReciter = { ...reciter, image: 'new-image.jpg' };

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(reciter as Reciter);
      jest.spyOn(repository, 'save').mockResolvedValue(updatedReciter as Reciter);

      expect(await service.updateReciterImage(1, 'new-image.jpg')).toEqual(updatedReciter);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(repository.save).toHaveBeenCalledWith(updatedReciter);
    });

    it('should throw NotFoundException if reciter is not found', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

      await expect(service.updateReciterImage(1, 'new-image.jpg')).rejects.toThrow(NotFoundException);
    });
  });
});