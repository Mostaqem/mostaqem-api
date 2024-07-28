import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Surah E2E TESTS', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should get list of all surah', () => {
    return request(app.getHttpServer())
      .get('/surah')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveLength(114);
        expect(res.body[0]).toMatchObject({
          id: 1,
          name_arabic: 'الفاتحة',
          name_complex: 'Al-Fatihah',
          revelation_place: 'meccan',
          verses_count: 7,
          image: 'image-url',
        });
      });
  });

  it('should get a surah by id', () => {
    return request(app.getHttpServer())
      .get('/surah/1')
      .expect(200)
      .expect((res) => {
        expect(res.body).toMatchObject({
          id: 1,
          name_arabic: 'الفاتحة',
          name_complex: 'Al-Fatihah',
          revelation_place: 'meccan',
          verses_count: 7,
          image: 'image-url',
        });
      });
  });

  describe('adding image section', () => {
    it('should add an image to a surah', () => {
      return request(app.getHttpServer())
        .patch('/surah/1')
        .send({ image: 'image-url' })
        .expect(200);
    });

    it('should return 404 if surah not found by id', () => {
      return request(app.getHttpServer())
        .patch('/surah/150')
        .send({ image: 'image-url' })
        .expect(404);
    });
  });

  it('should return  404 if surah not found by id', () => {
    return request(app.getHttpServer()).get('/surah/150').expect(404);
  });
});
