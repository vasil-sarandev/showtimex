import 'reflect-metadata';
import express from 'express';
import { setupApp } from './lib/setup-app';
import { APP_PORT } from './config';
import { appRouter } from '@/components/app-router';
import { errorMiddleware } from '@/middlewares/error';
import { loggerMiddleware } from '@/middlewares/logger';

const createServerCallback = () => {
  const app = express();

  // parse jsons
  app.use(express.json());
  // parse forms
  app.use(express.urlencoded({ extended: true }));

  app.use(loggerMiddleware);
  app.use(appRouter);
  app.use(errorMiddleware);

  app.listen(APP_PORT, '0.0.0.0', () => {
    return console.log(`Express is listening at http://localhost:${APP_PORT}`);
  });
};

setupApp(createServerCallback);
