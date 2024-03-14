import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { RoomDto } from '../src/rooms/dto/room.dto';
import { disconnect, Types } from 'mongoose';
import { RoomIdDto } from '../src/rooms/dto/roomId.dto';

describe('RoomsController (e2e)', () => {
  let app: INestApplication;
  let roomId: string;

  const testDto: RoomDto = {
    room_number: Math.floor(Math.random() * 31) + 1,
    room_type: Math.floor(Math.random() * 4) + 1,
    description: 'Default tests',
    sea_view: Boolean(Math.round(Math.random())),
  };
  const randomId = new Types.ObjectId().toHexString();
  const errorId = '65f369b4bbf22dc63233144dd';

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

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

      it('/rooms/:id (GET) - fail 404', () => {
        return request(app.getHttpServer())
          .get(`/room/${randomId}`)
          .send(testDto)
          .expect(404);
      });
    });

    describe('Обновление дынных комнаты по id', () => {
      it('/rooms/:id (PATCH) - success 200', async () => {
        const patchDto: RoomIdDto = {
          id: new Types.ObjectId(roomId),
          ...testDto,
          description: 'тест пройден!',
        };

        await request(app.getHttpServer())
          .patch('/rooms/' + roomId)
          .send(patchDto)
          .expect(200);
      });

      it('/rooms/:id (PATCH) - fail 404', async () => {
        const patchDto: RoomIdDto = {
          id: new Types.ObjectId(roomId),
          ...testDto,
          description: 'тест не пройден!',
        };

        await request(app.getHttpServer())
          .patch('/rooms/' + randomId)
          .send(patchDto)
          .expect(404);
      });
    });

    describe('Удаление комнаты по id', () => {
      it('/rooms/:id (DELETE) - success 200', () => {
        return request(app.getHttpServer())
          .delete('/rooms/' + roomId)
          .expect(200);
      });

      it('/rooms/:id (DELETE) - fail 404', () => {
        return request(app.getHttpServer())
          .delete('/rooms/' + randomId)
          .expect(404);
      });
    });

    // -----------------Вывод всех комнат
    it('/rooms/all (GET)  - success 200', async () => {
      await request(app.getHttpServer())
        .get('/rooms/all')
        .expect(200)
        .then(({ body }: request.Response) => {
          expect(body.length > 0).toBe(true);
          return;
        });
    });
    describe('Ошибки валидации', () => {
      it('rooms/create (POST) 400 validation error (room_type)', () => {
        return request(app.getHttpServer())
          .post('/rooms/create')
          .send({
            ...testDto,
            room_number: 1,
            room_type: 5,
          })
          .expect(400);
      });
      it('/rooms/create (POST) 400 validation error (sea_view)', () => {
        return request(app.getHttpServer())
          .post('/rooms/create')
          .send({
            ...testDto,
            sea_view: 'not_boolean',
          })
          .expect(400);
      });
      it('/rooms/create (POST) 400 validation error (room_number)', () => {
        return request(app.getHttpServer())
          .post('/rooms/create')
          .send({
            ...testDto,
            room_number: 32,
          })
          .expect(400);
      });

      it('/rooms (GET) 400 id must be a mongodb id', () => {
        return request(app.getHttpServer()).get('/rooms/0').expect(400);
      });
      it('/rooms (GET) 400 validation error (errorId)', () => {
        return request(app.getHttpServer())
          .get('/rooms/' + errorId)
          .expect(400);
      });
    });
  });
  afterAll(() => disconnect());
});
