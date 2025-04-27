import React, { useEffect, useState } from 'react';
import useChatStore from './store/chatStore';

function App() {
  const { connect, joinRoom, joinPrivateChat, sendMessage, messages, currentRoom, fetchHistory } = useChatStore();
  const [roomId, setRoomId] = useState('');
  const [message, setMessage] = useState('');
  const [privateUserId, setPrivateUserId] = useState('');

  useEffect(() => {
    const savedRoom = localStorage.getItem('roomId');
    const userId = localStorage.getItem('userId') || 'user1';
    connect(userId);
    if (savedRoom) {
      joinRoom(savedRoom);
      fetchHistory(savedRoom);
    }
  }, []);

  const handleJoinRoom = () => {
    localStorage.setItem('roomId', roomId);
    joinRoom(roomId);
    fetchHistory(roomId);
  };

  const handleJoinPrivate = () => {
    const userId = localStorage.getItem('userId') || 'user1';
    const privateRoomId = [userId, privateUserId].sort().join('_');
    localStorage.setItem('roomId', privateRoomId);
    joinPrivateChat(userId, privateUserId);
    fetchHistory(privateRoomId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold text-center text-indigo-700">✨ Real-Time Chat</h1>

        <div className="space-y-4">
          <div>
            <input
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Enter Public Room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
            />
            <button
              className="mt-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition duration-200"
              onClick={handleJoinRoom}
            >
              Join Public Room
            </button>
          </div>

          <div className="relative">
            <input
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Private Chat With User ID"
              value={privateUserId}
              onChange={(e) => setPrivateUserId(e.target.value)}
            />
            <button
              className="mt-2 w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded-lg transition duration-200"
              onClick={handleJoinPrivate}
            >
              Start Private Chat
            </button>
          </div>

          <div>
            <input
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              className="mt-2 w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg transition duration-200"
              onClick={() => sendMessage(currentRoom, message)}
            >
              Send Message
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-700">📨 Messages:</h2>
          <div className="border border-gray-200 rounded-lg h-64 overflow-y-auto p-4 bg-gray-50">
            {messages.length > 0 ? (
              <ul className="space-y-2">
                {messages.map((msg, idx) => (
                  <li key={idx} className="text-sm text-gray-700">
                    <span className="font-bold text-indigo-600">{msg.userId}:</span> {msg.message}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-400 text-sm text-center mt-10">
                No messages yet. Start chatting! 🚀
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
