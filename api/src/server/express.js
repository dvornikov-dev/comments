import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import prismaService from '../services/prisma.service.js';
import UserController from '../users/users.controller.js';
import CommentController from '../comments/comments.controller.js';
import CaptchaController from '../captcha/captcha.controller.js';
import errorMiddleware from '../middlewares/error.middleware.js';
import NodeCache from 'node-cache';
import EventEmitter from 'events';
import FileService from '../services/file.service.js';
import FileRepository from '../common/file.repository.js';
import { Queue, Worker } from 'bullmq';

export default async (port) => {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb' }));

  //init socket connection
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: '*',
  });
  const clients = [];
  io.on('connection', (socket) => {
    console.log(`Client with id ${socket.id} connected`);
    clients.push(socket.id);
    socket.on('message', (message) => console.log('Message: ', message));

    socket.on('disconnect', () => {
      clients.splice(clients.indexOf(socket.id), 1);
      console.log(`Client with id ${socket.id} disconnected`);
    });
  });

  //cache and event emitter
  const cache = new NodeCache({ stdTTL: 300 });
  const eventEmitter = new EventEmitter();

  //file queque
  const fileQueue = new Queue('fileQueue', {
    connection: {
      host: 'redis',
      port: 6379,
    },
  });

  const fileService = new FileService();
  const fileRepository = new FileRepository();

  const worker = new Worker(
    'fileQueue',
    async (job) => {
      if (job.name === 'processFile') {
        const file = job.data.file;
        const fileObj = await fileService.saveFile(file.file, file.extension);
        const fileModel = await fileRepository.addFile({
          commentId: file.commentId,
          ...fileObj,
        });
      }
    },
    {
      connection: {
        host: 'redis',
        port: 6379,
      },
    },
  );
  worker.on('completed', (job) => {
    eventEmitter.emit('commentsUpdated');
    console.log(`Job ${job.id} completed`);
  });

  //routes
  const userController = new UserController(io);
  app.use('/users', userController.router);
  const commentsController = new CommentController(
    io,
    cache,
    eventEmitter,
    fileQueue,
  );
  app.use('/comments', commentsController.router);
  const captchaController = new CaptchaController();
  app.use('/captcha', captchaController.router);
  app.use(errorMiddleware);

  //db
  await prismaService.connect();

  httpServer.listen(port, () =>
    console.log(`Server listens http://localhost:${port}`),
  );
};
