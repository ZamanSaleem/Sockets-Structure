// frontend/src/store/chatStore.js
import { create } from 'zustand';
import { io } from 'socket.io-client';
import axios from 'axios';

let socket;

const useChatStore = create((set, get) => ({
  messages: [],
  currentRoom: null,

  connect: (userId) => {
    localStorage.setItem('userId', userId);
    socket = io('http://localhost:5000/chat', {
      query: { token: 'valid_token', userId },
    });

    socket.on('receiveMessage', ({ userId, message }) => {
      set((state) => ({
        messages: [...state.messages, { userId, message }],
      }));
    });

    const savedRoom = localStorage.getItem('roomId');
    if (savedRoom) {
      get().joinRoom(savedRoom);
      get().fetchHistory(savedRoom);
    }
  },

  joinRoom: (roomId) => {
    socket.emit('joinRoom', roomId);
    set({ currentRoom: roomId });
    localStorage.setItem('roomId', roomId);
  },

  joinPrivateChat: (userId1, userId2) => {
    socket.emit('joinPrivateChat', { userId1, userId2 });
    const roomId = [userId1, userId2].sort().join('_');
    set({ currentRoom: roomId });
    localStorage.setItem('roomId', roomId);
  },

  sendMessage: (roomId, message) => {
    if (!roomId || !message) return;
    socket.emit('sendMessage', { roomId, message });
  },

  fetchHistory: async (roomId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/chat/history/${roomId}`);
      set({ messages: res.data || [] });
    } catch (err) {
      console.error('Error fetching chat history', err);
    }
  },
}));

export default useChatStore;
