import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import 'dotenv/config';

export default (port) => {
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

  app.post('/comment', (req, res) => {
    console.log(req.body);
    io.emit('update', 'update');
  });

  httpServer.listen(port, () =>
    console.log(`Server listens http://localhost:${port}`),
  );
};
