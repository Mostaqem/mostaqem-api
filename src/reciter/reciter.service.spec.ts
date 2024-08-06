import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReciterService } from './reciter.service';
import { Reciter } from './entities/reciter.entity';
import { Tilawa } from './entities/tilawa.entity';
import { CreateReciterDto } from './dto/create-reciter.dto';
import { NotFoundException } from '@nestjs/common';
import { AddTilawaDto } from './dto/add-tilawa.dto';

describe('ReciterService', () => {
  let service: ReciterService;
  let reciterRepository: Repository<Reciter>;
  let tilawaRepository: Repository<Tilawa>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReciterService,
        {
          provide: getRepositoryToken(Reciter),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Tilawa),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<ReciterService>(ReciterService);
    reciterRepository = module.get<Repository<Reciter>>(getRepositoryToken(Reciter));
    tilawaRepository = module.get<Repository<Tilawa>>(getRepositoryToken(Tilawa));
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

      jest.spyOn(reciterRepository, 'create').mockReturnValue(reciter as Reciter);
      jest.spyOn(reciterRepository, 'save').mockResolvedValue(reciter as Reciter);

      expect(await service.create(createReciterDto)).toEqual(reciter);
      expect(reciterRepository.create).toHaveBeenCalledWith(createReciterDto);
      expect(reciterRepository.save).toHaveBeenCalledWith(reciter);
    });
  });

  describe('findAll', () => {
    it('should return all reciters ordered by name_english', async () => {
      const reciters = [
        { id: 1, name_english: 'John Doe', name_arabic: 'جون دو' },
        { id: 2, name_english: 'Jane Doe', name_arabic: 'جين دو' },
      ];

      jest.spyOn(reciterRepository, 'find').mockResolvedValue(reciters as Reciter[]);

      expect(await service.findAll('eng')).toEqual(reciters);
      expect(reciterRepository.find).toHaveBeenCalledWith({ order: { name_english: 'ASC' } });
    });

    it('should return all reciters ordered by name_arabic', async () => {
      const reciters = [
        { id: 1, name_english: 'John Doe', name_arabic: 'جون دو' },
        { id: 2, name_english: 'Jane Doe', name_arabic: 'جين دو' },
      ];

      jest.spyOn(reciterRepository, 'find').mockResolvedValue(reciters as Reciter[]);

      expect(await service.findAll('ar')).toEqual(reciters);
      expect(reciterRepository.find).toHaveBeenCalledWith({ order: { name_arabic: 'ASC' } });
    });
  });

  describe('findOne', () => {
    it('should return a single reciter', async () => {
      const reciter = { id: 1, name_english: 'John Doe', name_arabic: 'جون دو' };

      jest.spyOn(reciterRepository, 'findOneBy').mockResolvedValue(reciter as Reciter);

      expect(await service.findOne(1)).toEqual(reciter);
      expect(reciterRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw NotFoundException if reciter is not found', async () => {
      jest.spyOn(reciterRepository, 'findOneBy').mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateReciterImage', () => {
    it('should update reciter image', async () => {
      const reciter = { id: 1, name_english: 'John Doe', name_arabic: 'جون دو', image: 'old-image.jpg' };
      const updatedReciter = { ...reciter, image: 'new-image.jpg' };

      jest.spyOn(reciterRepository, 'findOneBy').mockResolvedValue(reciter as Reciter);
      jest.spyOn(reciterRepository, 'save').mockResolvedValue(updatedReciter as Reciter);

      expect(await service.updateReciterImage(1, 'new-image.jpg')).toEqual(updatedReciter);
      expect(reciterRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(reciterRepository.save).toHaveBeenCalledWith(updatedReciter);
    });

    it('should throw NotFoundException if reciter is not found', async () => {
      jest.spyOn(reciterRepository, 'findOneBy').mockResolvedValue(null);

      await expect(service.updateReciterImage(1, 'new-image.jpg')).rejects.toThrow(NotFoundException);
    });
  });

  describe('addDefaultTilawaToReciters', () => {
    it('should add default tilawa to reciters if no tilawa exists', async () => {
      jest.spyOn(tilawaRepository, 'find').mockResolvedValueOnce([]);
      jest.spyOn(reciterRepository, 'find').mockResolvedValueOnce([
        { id: 1, name_english: 'Reciter 1' },
        { id: 2, name_english: 'Reciter 2' },
      ] as Reciter[]);
      jest.spyOn(tilawaRepository, 'create').mockReturnValue({} as Tilawa);
      jest.spyOn(tilawaRepository, 'save').mockResolvedValue({} as Tilawa);

      await service.addDefaultTilawaToReciters();

      expect(tilawaRepository.create).toHaveBeenCalledTimes(2);
      expect(tilawaRepository.save).toHaveBeenCalledTimes(2);
    });

    it('should not add default tilawa if tilawa already exists', async () => {
      jest.spyOn(tilawaRepository, 'find').mockResolvedValueOnce([{} as Tilawa]);
      jest.spyOn(reciterRepository, 'find').mockResolvedValueOnce([]);

      await service.addDefaultTilawaToReciters();

      expect(reciterRepository.find).not.toHaveBeenCalled();
    });
  });

  describe('getReciterTilawaId', () => {
    it('should return tilawa id for a reciter', async () => {
      const mockTilawa = { id: 1, reciter_id: 1 } as Tilawa;
      jest.spyOn(tilawaRepository, 'findOneBy').mockResolvedValueOnce(mockTilawa);

      const result = await service.getReciterTilawaId(1);

      expect(result).toBe(1);
      expect(tilawaRepository.findOneBy).toHaveBeenCalledWith({ reciter_id: 1 });
    });

    it('should throw NotFoundException if tilawa not found', async () => {
      jest.spyOn(tilawaRepository, 'findOneBy').mockResolvedValueOnce(null);

      await expect(service.getReciterTilawaId(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getReciterTilawa', () => {
    it('should return tilawas for a reciter', async () => {
      const mockTilawas = [{ id: 1, reciter_id: 1 }, { id: 2, reciter_id: 1 }] as Tilawa[];
      jest.spyOn(tilawaRepository, 'find').mockResolvedValue(mockTilawas);

      const result = await service.getReciterTilawa(1);

      expect(result).toEqual(mockTilawas);
      expect(tilawaRepository.find).toHaveBeenCalledWith({ where: { reciter_id: 1 } });
    });

    it('should throw NotFoundException if no tilawas found', async () => {
      jest.spyOn(tilawaRepository, 'find').mockResolvedValue([]);

      await expect(service.getReciterTilawa(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('addReciterTilawa', () => {
    it('should add a new tilawa to a reciter', async () => {
      const addTilawaDto: AddTilawaDto = {
        name: 'New Tilawa',
        name_english: 'New Tilawa',
        reciter_id: 1  // Add this line
      };
      const mockTilawa = { id: 1, ...addTilawaDto } as Tilawa;

      jest.spyOn(tilawaRepository, 'create').mockReturnValue(mockTilawa);
      jest.spyOn(tilawaRepository, 'save').mockResolvedValue(mockTilawa);

      const result = await service.addReciterTilawa(1, addTilawaDto);

      expect(result).toEqual(mockTilawa);
      expect(tilawaRepository.create).toHaveBeenCalledWith(addTilawaDto);
      expect(tilawaRepository.save).toHaveBeenCalledWith(mockTilawa);
    });
  });
});