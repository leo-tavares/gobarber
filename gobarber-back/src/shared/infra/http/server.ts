import 'reflect-metadata';

import cors from 'cors';
import express, { Request, Response, NextFunction } from 'express';

import uploadConfig from '@config/upload';
import 'express-async-errors';

import AppError from '@shared/errors/AppError';

import routes from './routes';

import '@shared/infra/typeorm';
import '@shared/container';

const app = express();

// app.use(
//   cors({
//     origin: 'http://localhost:3333',
//   }),
// );

app.use(cors());

app.use(express.json());
app.use('/files', express.static(uploadConfig.uploadsFolder));
app.use(routes);

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response
      .status(err.statusCode)
      .json({ status: 'error', message: err.message });
  }
  console.error(err);

  return response.status(500).json({
    status: 'error',
    message: 'Internal server',
  });
});

app.listen(3333, () => {
  console.log('🚀 Server started on port 3333!');
});
