import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { RoomDto } from '../src/rooms/dto/room.dto';
import { Types } from 'mongoose';
import { RoomIdDto } from '../src/rooms/dto/roomId.dto';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let roomId: string;
  const testDto: RoomDto = {
    room_number: Math.floor(Math.random() * 31) + 1,
    room_type: Math.floor(Math.random() * 4) + 1,
    description: 'Default tests',
    sea_view: Boolean(Math.round(Math.random())),
  };
  const randomId = new Types.ObjectId().toHexString();

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  // -------------Создание комнаты
  describe('Default tests', () => {
    it('/rooms/create (POST) - success 201', async () => {
      return request(app.getHttpServer())
        .post('/rooms/create')
        .send(testDto)
        .expect(201)
        .then(({ body }: request.Response) => {
          roomId = body.newRoom._id;
          expect(roomId).toBeDefined();
          return;
        });
    });

    describe('Вывод информации о комнате', () => {
      it('/rooms/:id (GET) - success 200', async () => {
        return request(app.getHttpServer())
          .get('/rooms/' + roomId)
          .send(testDto)
          .expect(200)
          .then(({ body }: request.Response) => {
            expect(roomId === body._id).toBe(true);
            return;
          });
      });

      it('/rooms/:id (GET) - fail 404', async () => {
        await request(app.getHttpServer())
          .get(`/room/${randomId}`)
          .send(testDto)
          .expect(404);
      });
    });

    // -----------------Обновление дынных комнаты по id

    it('rooms/:id (PATCH) - success 200', async () => {
      const patchDto: RoomIdDto = {
        id: new Types.ObjectId(roomId),
        ...testDto,
        description: 'тест пройден!',
      };

      return request(app.getHttpServer())
        .patch('/rooms/' + roomId)
        .send(patchDto)
        .expect(200);
    });

    it('rooms/:id (PATCH) - fail 404', async () => {
      const patchDto: RoomIdDto = {
        id: new Types.ObjectId(roomId),
        ...testDto,
        description: 'тест не пройден!',
      };

      return request(app.getHttpServer())
        .patch('/rooms/' + randomId)
        .send(patchDto)
        .expect(404);
    });

    // -----------------Удаление комнаты по id
    it('rooms/:id (DELETE) - success 200', async () => {
      return request(app.getHttpServer())
        .delete('/rooms/' + roomId)
        .expect(200);
    });

    it('/rooms/:id (DELETE) - fail 404', () => {
      return request(app.getHttpServer())
        .delete('/rooms/' + randomId)
        .expect(404);
    });

    // -----------------Вывод всех комнат
    it('rooms/all (GET)  - success 200', () => {
      return request(app.getHttpServer())
        .get('/rooms/all')
        .expect(200)
        .then(({ body }: request.Response) => {
          expect(body.length > 0).toBe(true);
          return;
        });
    });
  });
});
