const http = require('http')
const app = require('./app')
const { Server } = require('socket.io')
const redis = require('./utils/redisClient');
const { messageQueue } = require('./utils/messageQueue');

const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: "*",
        credentials: true,
    }
})

const chatNamespace = io.of('/chat')

chatNamespace.use((socket, next) =>{
  const { token, userId } = socket.handshake.query;
  if (token === 'valid_token') {
    socket.userId = userId;
    next();
  } else {
    next(new Error('Unauthorized'));
  }
})


chatNamespace.on('connection', (socket) => {
    console.log(`User ${socket.userId} connected`);

    socket.on('joinroom', (roomId) => {
        socket.join(roomId)
        socket.currentRoom = roomId
        console.log(`${socket.userId} joined publib room ${roomId}`);
    })

    socket.on('joinPrivateChat', ({userId1, userId2}) => {
        const roomId = [userId1,userId2].sort().join('_')
        socket.join(roomId)
        socket.currentRoom = roomId
        console.log(`${socket.userId} joined private chat ${roomId}`);
    })

    socket.on('sendMessage',async ({message, roomId}) => {
        const payload = { userId : socket.userId, message}

        if(socket.rooms.has(roomId)){
            chatNamespace.to(roomId).emit('receiveMessage',payload)
        }
        else {
            await messageQueue.add('sendOfflineMessage', {
                userId: socket.userId,
                message, roomId
        })}

        await redis.rPush(`room:${roomId}:messages`, JSON.stringify(payload))
    })

    socket.on('disconnect', () => {
        console.log(`User ${socket.userId} disconnected`);
        
    })
    
})

const PORT = process.env.PORT || 5000
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`))

module.exports = {chatNamespace}