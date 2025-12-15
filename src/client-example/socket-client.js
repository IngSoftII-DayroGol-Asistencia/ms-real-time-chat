const { io } = require('socket.io-client');

const URL = 'http://localhost:3000';
const socket = io(URL, { transports: ['websocket'] });

// Replace these with real user ids for testing
const MY_ID = 'user-1';
const OTHER_ID = 'user-2';

socket.on('connect', () => {
  console.log('connected', socket.id);

  // Listen to per-user events
  socket.on(`algo_${MY_ID}`, (msg) => console.log('evento algo_MY_ID:', msg));
  socket.on(`algo_${OTHER_ID}`, (msg) => console.log('evento algo_OTHER_ID:', msg));

  // Send a message to another user
  socket.emit('message', { content: 'Hola desde client example', author_id: MY_ID, receiver_id: OTHER_ID });
});

socket.on('disconnect', () => console.log('disconnected'));
