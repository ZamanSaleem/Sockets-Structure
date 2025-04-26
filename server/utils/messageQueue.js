const { Queue, Worker} = require("bullmq")
const redis = require ('./redisClient')

const messageQueue = new Queue("offlineMessages", {
    redis:{
        host: 'localhost',
        port: 6379
    }
})

const worker = new Worker('offlineMessages', async job => {
    const {userId, message, roomId} = job.data

    const chatNamespace = require('../server').chatNamespace;
    chatNamespace.to(roomId).emit('receiveMessage', {userId, message})

    console.log(`Delivered message to ${userId} in room ${roomId}`);
},{
    redis:{
        host: 'localhost',
        port: 6379
    }
}
)

module.exports = {messageQueue}