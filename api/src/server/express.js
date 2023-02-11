import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import prismaService from '../services/prisma.service.js';
import UserController from '../users/users.controller.js';
import CommentController from '../comments/comments.controller.js';
import 'dotenv/config';
import errorMiddleware from '../middlewares/error.middleware.js';

export default async (port) => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: '*',
  });
  const clients = [];
  io.on('connection', (socket) => {
    console.log(`Client with id ${socket.id} connected`);
    clients.push(socket.id);

    socket.emit('message', 'Im server');

    socket.on('message', (message) => console.log('Message: ', message));

    socket.on('disconnect', () => {
      clients.splice(clients.indexOf(socket.id), 1);
      console.log(`Client with id ${socket.id} disconnected`);
    });
  });

  const userController = new UserController(io);
  app.use('/users', userController.router);
  const commentsController = new CommentController(io);
  app.use('/comments', commentsController.router);
  app.use(errorMiddleware);
  await prismaService.connect();

  httpServer.listen(port, () =>
    console.log(`Server listens http://localhost:${port}`),
  );
};
