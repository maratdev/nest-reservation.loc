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
  const randomId = new Types.ObjectId().toHexString();
  const reserveTestDto: ReserveDto = {
    checkInDate: Math.floor(Math.random() * 31) + 1,
    room_id: room_id,
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
      await request(app.getHttpServer())
        .post('/rooms/create')
        .send({
          ...roomTestDto,
          room_number: Math.floor(Math.random() * 31) + 1,
        })
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
      it('/rooms/:id (PATCH) - success 200', async () => {
        const patchDto: GetIdReserveDto = {
          id: new Types.ObjectId(reserve_id),
          ...reserveTestDto,
          checkInDate: Math.floor(Math.random() * 5) + 1, // допустимые дни
        };
        await request(app.getHttpServer())
          .patch('/reserve/' + reserve_id)
          .send(patchDto)
          .expect(200);
      });
    });
  });
});
