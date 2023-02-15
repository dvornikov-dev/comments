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

  //routes
  const userController = new UserController(io);
  app.use('/users', userController.router);
  const commentsController = new CommentController(io, cache, eventEmitter);
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
