import express from 'express';
import { Server } from 'socket.io';
import bodyParser from 'body-parser';
import http from 'http';

// ---------- Express Server on Port 8000 ----------
const app = express();
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Express server is running');
});

app.listen(8000, () => {
  console.log('Express server running on port 8000');
});

// ---------- Socket.IO Server on Port 8001 ----------
const ioServer = http.createServer(); // No express needed here

const io = new Server(ioServer, {
  cors: {
    origin: "*",
  },
});

const emailToSocketMapping = new Map<string, string>();

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('join-room', (data: { roomId: string; emailId: string }) => {
    const { roomId, emailId } = data;
    console.log(`User ${emailId} joined room ${roomId}`);

    emailToSocketMapping.set(emailId, socket.id);
    socket.join(roomId);
    socket.broadcast.to(roomId).emit('user-joined', { emailId });
  });
});

ioServer.listen(8001, () => {
  console.log('Socket.IO server running on port 8001');
});
