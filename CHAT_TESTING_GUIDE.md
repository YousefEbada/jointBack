# Chat Application Testing Guide

## Overview

This guide provides comprehensive testing instructions for the Socket.IO-based chat application between patients and doctors.

## Prerequisites

1. **Start the server**: Make sure your Node.js server is running on port 4000
2. **Database**: MongoDB should be connected
3. **JWT Tokens**: You need valid JWT tokens for both patient and doctor users

## Testing Methods

### 1. Using the HTML Test Client

The easiest way to test the chat functionality:

1. Open `test/chat-test-client.html` in your web browser
2. Enter your server URL (default: http://localhost:4000)
3. Paste a valid JWT token
4. Select user type (patient or doctor)
5. Click "Connect Socket"

#### Getting JWT Tokens

You can get JWT tokens by:
- Logging in through your existing auth endpoints
- Using Postman to call `/api/auth/login`
- Manually creating tokens for testing

Example token payload:
```json
{
  "id": "user_id_here",
  "userType": "patient", // or "doctor"
  "email": "user@example.com"
}
```

### 2. REST API Testing with Postman/curl

#### Create Chat Room
```bash
curl -X POST http://localhost:4000/api/chat/rooms \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "patientId": "patient_user_id",
    "doctorId": "doctor_user_id",
    "metadata": {
      "patientName": "John Doe",
      "doctorName": "Dr. Smith"
    }
  }'
```

#### Get Chat Rooms
```bash
curl -X GET http://localhost:4000/api/chat/rooms \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Send Message
```bash
curl -X POST http://localhost:4000/api/chat/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "roomId": "room_uuid_here",
    "messageType": "text",
    "content": "Hello, this is a test message!"
  }'
```

#### Get Messages
```bash
curl -X GET "http://localhost:4000/api/chat/rooms/ROOM_ID/messages?page=1&limit=50" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Mark Messages as Read
```bash
curl -X POST http://localhost:4000/api/chat/rooms/ROOM_ID/mark-read \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 3. Socket.IO Testing with JavaScript

#### Basic Connection Test
```javascript
const io = require('socket.io-client');

const socket = io('http://localhost:4000', {
  auth: {
    token: 'YOUR_JWT_TOKEN'
  }
});

socket.on('connect', () => {
  console.log('Connected to chat server');
  
  // Join rooms
  socket.emit('rooms:join', {
    roomIds: ['room_id_1', 'room_id_2']
  });
});

socket.on('message:received', (message) => {
  console.log('New message:', message);
});

// Send a message
socket.emit('message:send', {
  roomId: 'room_id_here',
  messageType: 'text',
  content: 'Hello from Socket.IO client!'
});
```

### 4. Manual Testing Scenarios

#### Scenario 1: Patient-Doctor Conversation
1. Open the HTML test client in two browser tabs
2. In tab 1: Login as a patient
3. In tab 2: Login as a doctor
4. Create a room between the patient and doctor
5. Start a conversation and verify:
   - Messages appear in real-time
   - Typing indicators work
   - Message timestamps are correct
   - Read receipts work

#### Scenario 2: Multiple Rooms
1. Create multiple chat rooms with different doctor-patient pairs
2. Switch between rooms and verify:
   - Messages are isolated to correct rooms
   - Room list updates correctly
   - Socket joins/leaves rooms properly

#### Scenario 3: Connection Handling
1. Connect, send messages, then disconnect
2. Reconnect and verify:
   - Previous messages are loaded
   - Connection status updates
   - Room rejoining works

### 5. Database Verification

Check MongoDB collections directly:

#### Chat Rooms Collection
```javascript
db.chat_rooms.find().pretty()
```

#### Chat Messages Collection
```javascript
db.chat_messages.find().sort({createdAt: -1}).limit(10).pretty()
```

## Test Data Setup

### Create Test Users

You'll need user records in your users collection with:
- Patient user with `userType: 'patient'`
- Doctor user with `userType: 'doctor'`

### Sample Test Flow

1. **Setup**: Create test patient and doctor users
2. **Authentication**: Get JWT tokens for both users
3. **Room Creation**: Patient or doctor creates a chat room
4. **Real-time Chat**: Both users join and exchange messages
5. **Persistence**: Verify messages are saved to database
6. **Read Status**: Test message read functionality

## Troubleshooting

### Common Issues

1. **Authentication Failures**
   - Verify JWT token is valid and not expired
   - Check token includes required fields: `id`, `userType`, `email`

2. **Socket Connection Issues**
   - Check CORS settings in server.ts
   - Verify server is running on correct port
   - Check browser developer console for errors

3. **Message Not Appearing**
   - Verify users are in the same room
   - Check database for message persistence
   - Ensure Socket.IO events are properly bound

4. **Room Access Denied**
   - Verify user is authorized for the room
   - Check patientId/doctorId match user credentials

### Debug Tools

1. **Browser DevTools**: Check Network and Console tabs
2. **Server Logs**: Monitor console output for errors
3. **MongoDB Compass**: Inspect database collections
4. **Socket.IO Debug**: Add `localStorage.debug = 'socket.io-client:*'` in browser console

## Performance Testing

### Load Testing Socket Connections
```javascript
// Simple load test script
for (let i = 0; i < 50; i++) {
  const socket = io('http://localhost:4000', {
    auth: { token: 'test_token' }
  });
  
  socket.on('connect', () => {
    console.log(`Socket ${i} connected`);
  });
}
```

### Message Throughput Test
Send multiple messages rapidly and verify:
- All messages are received
- Order is preserved
- No messages are lost

## API Response Format

All REST endpoints return responses in this format:

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "timestamp": "2024-01-01T00:00:00.000Z",
  "traceId": "abc123"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error description",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "traceId": "abc123"
}
```

## Next Steps

After basic testing is successful:
1. Implement file upload testing for image/document messages
2. Test message editing functionality
3. Add automated unit and integration tests
4. Performance testing with multiple concurrent users
5. Test error scenarios and edge cases