const redis = require('../utils/redisClient');

const getRoomMessages = async (roomId) => {
  const messages = await redis.lRange(`room:${roomId}:messages`, 0, -1);
  return messages.map((msg) => JSON.parse(msg));
};

module.exports = {
  getRoomMessages,
};