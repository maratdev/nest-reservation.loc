import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import { ReserveDto } from '../src/reserve/dto/reserve.dto';
import { Types } from 'mongoose';
import { roomTestDto } from './rooms.e2e-spec';
import { GetIdReserveDto } from '../src/reserve/dto/reserve-id.dto';

describe('ReserveController (e2e)', () => {
  let app: INestApplication;
  let room_id: Types.ObjectId;
  let reserve_id: string;
  const errorId = '65f369b4bbf22dc63233144dd';
  const randomId = new Types.ObjectId().toHexString();
  const reserveTestDto: ReserveDto = {
    checkInDate: Math.floor(Math.random() * 31) + 1,
    room_id: room_id,
  };
  const patchDto: GetIdReserveDto = {
    id: new Types.ObjectId(reserve_id),
    ...reserveTestDto,
    checkInDate: Math.floor(Math.random() * 5) + 1, // допустимые дни
  };

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
        .send({
          ...roomTestDto,
          room_number: Math.floor(Math.random() * 31) + 1,
        })
        .expect(201)
        .then(({ body }: request.Response) => {
          room_id = body.newRoom?._id;
          reserveTestDto.room_id = room_id;
          expect(room_id).toBeDefined();
          return;
        });
    });

    it('/reserve/create (POST) - success 201', async () => {
      return request(app.getHttpServer())
        .post('/reserve/create')
        .send(reserveTestDto)
        .expect(201)
        .then(({ body }: request.Response) => {
          reserve_id = body.newReserve._id;
          expect(reserve_id).toBeDefined();
          return;
        });
    });
    describe('Вывод информации о резерве', () => {
      it('/reserve/:id (GET) - success 200', async () => {
        return request(app.getHttpServer())
          .get('/reserve/' + reserve_id)
          .send(reserveTestDto)
          .expect(200)
          .then(({ body }: request.Response) => {
            expect(reserve_id === body._id).toBe(true);
            return;
          });
      });
      it('/reserve/:id (GET) - fail 404', () => {
        return request(app.getHttpServer())
          .get(`/reserve/${randomId}`)
          .send(roomTestDto)
          .expect(404);
      });
    });
    describe('Обновление дынных резерва по id', () => {
      it('/reserve/:id (PATCH) - success 200', async () => {
        await request(app.getHttpServer())
          .patch('/reserve/' + reserve_id)
          .send({ ...patchDto, room_id })
          .expect(200);
      });

      it('/reserve/:id (PATCH) - fail 404', async () => {
        await request(app.getHttpServer())
          .patch('/reserve/' + randomId)
          .send({ ...patchDto, room_id })
          .expect(404);
      });
    });
    describe('Удаление резерва по id', () => {
      it('/reserve/:id (DELETE) - success 200', () => {
        return request(app.getHttpServer())
          .delete('/reserve/' + reserve_id)
          .expect(200);
      });
      it('/reserve/:id (DELETE) - fail 404', () => {
        return request(app.getHttpServer())
          .delete('/reserve/' + randomId)
          .expect(404);
      });
    });
    // -----------------Вывод всех комнат
    it('/reserve/all (GET)  - success 200', async () => {
      await request(app.getHttpServer())
        .get('/reserve/all')
        .expect(200)
        .then(({ body }: request.Response) => {
          expect(body.length > 0).toBe(true);
          return;
        });
    });

    describe('Ошибки валидации', () => {
      it('reserve/create (POST) 400 validation error (checkInDate)', () => {
        return request(app.getHttpServer())
          .post('/reserve/create')
          .send({
            ...reserveTestDto,
            checkInDate: 32,
          })
          .expect(400);
      });
      it('reserve/create (POST) 400 validation error (room_id)', () => {
        return request(app.getHttpServer())
          .post('/reserve/create')
          .send({
            ...patchDto,
            room_id: 400,
          })
          .expect(400);
      });
      it('reserve/:id (PATCH) 400 validation error (checkInDate)', () => {
        return request(app.getHttpServer())
          .patch('/reserve/' + reserve_id)
          .send({
            ...patchDto,
            checkInDate: 0,
          })
          .expect(400);
      });
      it('/reserve (GET) 400 id must be a mongodb id', () => {
        return request(app.getHttpServer()).get('/reserve/0').expect(400);
      });
      it('/reserve (GET) 400 validation error (errorId)', () => {
        return request(app.getHttpServer())
          .get('/reserve/' + errorId)
          .expect(400);
      });
    });
  });
});
