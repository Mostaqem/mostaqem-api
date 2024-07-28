import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Reciter E2E TESTS', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should get all reciters', () => {
    return request(app.getHttpServer()).get('/reciter').expect(200);
  });

  it('should get reciter by id', () => {
    return request(app.getHttpServer()).get('/reciter/1').expect(200);
  });

  it('should return 404 if reciter not found by id', () => {
    return request(app.getHttpServer()).get('/reciter/99999').expect(404);
  });

  describe('adding image section', () => {
    it('should add an image to a reciter', () => {
      return request(app.getHttpServer())
        .patch('/reciter/1')
        .send({ image: 'image-url' })
        .expect(200);
    });

    it('should return 404 if reciter not found by id', () => {
      return request(app.getHttpServer())
        .patch('/reciter/99999')
        .send({ image: 'image-url' })
        .expect(404);
    });
  });
});
