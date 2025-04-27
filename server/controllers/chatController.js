const chatService =  require('../services/chatService')

const getChatHistory = async (req, res) => {
    try {
        const roomId= req.params.roomId
        const messages = await chatService.getRoomMessages(roomId)
        res.status(200).json(messages)
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch chat history' });
    }
}

module.exports = {
    getChatHistory,
  };