const { createClient } = require("redis")

const redisClient = createClient()

redisClient.on('error', (error) => console.log("Redis error", error))
redisClient.connect()

module.exports = redisClient