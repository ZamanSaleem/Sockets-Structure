const { Queue, Worker } = require('bullmq');
const redis = require('./redisClient'); 

const messageQueue = new Queue('offlineMessages', {
  connection: redis,   
});

const worker = new Worker('offlineMessages', async (job) => {
  const { userId, message, roomId } = job.data;

  const chatNamespace = require('../server').chatNamespace;
  chatNamespace.to(roomId).emit('receiveMessage', { userId, message });

  console.log(`Delivered message to ${userId} in room ${roomId}`);
}, {
  connection: redis,  
});

module.exports = { messageQueue };
