import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

/**
 * End-to-End (E2E) test for the main application.
 *
 * This test checks if the application starts correctly and
 * responds to the basic GET request on the root path (`/`).
 */
describe('AppController (e2e)', () => {
  // Variable that will store the NestJS application instance
  let app: INestApplication<App>;

  /**
   * This function runs before each test.
   * It creates a testing module using the main AppModule
   * and initializes the NestJS application.
   */
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  /**
   * Test that checks if the root endpoint (`/`) returns "Hello World!".
   *
   * - Sends a GET request to `/`
   * - Expects a 200 HTTP status (OK)
   * - Expects the response text to be "Hello World!"
   */
  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});
