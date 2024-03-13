import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  // -----------------Вывод всех комнат
  it('rooms/all (GET)  - success', () => {
    return request(app.getHttpServer())
      .get('/rooms/all')
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body.length).toBe(1);
        return;
      });
  });
});
