import { HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { Guid } from 'guid-typescript';
import { postgresClient, app } from './test.setup';

describe('AppController (e2e)', () => {
  let httpServer: any;

  beforeEach(() => {
    httpServer = app.getHttpServer();
  });

  afterEach(async () => {
    await postgresClient.query('DELETE FROM "Projects" CASCADE');
  });

  it('/domain (POST)', async () => {
    const response = await request(httpServer).post('/domain').send({ name: 'test' });
    expect(response.status).toBe(HttpStatus.OK);
    expect(response.text).not.toEqual(Guid.EMPTY.toString());

  });

  it('/domain (GET)', async () => {
    const response = await request(app.getHttpServer()).get('/domain');
    expect(response.status).toBe(200);
    expect(response.body.projects).toMatchObject([]);
    expect(response.body.total).toBeGreaterThanOrEqual(0);
  });
});
