# Chat API Documentation

This document describes the Chat API endpoints and Socket.IO events for real-time communication between patients and doctors.

## REST API Endpoints

All endpoints require authentication via JWT token in the Authorization header.

### 1. Get Chat Rooms

**GET** `/api/chat/rooms`

Retrieves all chat rooms for the authenticated user.

**Response:**
```json
{
  "ok": true,
  "data": [
    {
      "_id": "room_id",
      "patientId": "patient_id",
      "doctorId": "doctor_id", 
      "roomId": "uuid",
      "status": "active",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "lastMessageAt": "2024-01-01T00:00:00.000Z",
      "metadata": {
        "patientName": "John Doe",
        "doctorName": "Dr. Smith",
        "bookingId": "booking_id"
      }
    }
  ],
  "message": "Rooms retrieved successfully"
}
```

### 2. Create Chat Room

**POST** `/api/chat/rooms`

Creates a new chat room between a patient and doctor.

**Request Body:**
```json
{
  "patientId": "patient_id",
  "doctorId": "doctor_id",
  "metadata": {
    "patientName": "John Doe",
    "doctorName": "Dr. Smith",
    "bookingId": "booking_id" // optional
  }
}
```

**Response:**
```json
{
  "ok": true,
  "data": {
    "_id": "room_id",
    "patientId": "patient_id",
    "doctorId": "doctor_id",
    "roomId": "uuid",
    "status": "active",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Room created successfully"
}
```

### 3. Get Messages

**GET** `/api/chat/rooms/:roomId/messages?page=1&limit=50`

Retrieves messages from a chat room with pagination.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Messages per page (default: 50, max: 100)

**Response:**
```json
{
  "ok": true,
  "data": {
    "messages": [
      {
        "_id": "message_id",
        "roomId": "room_id",
        "senderId": "user_id",
        "senderType": "patient",
        "messageType": "text",
        "content": "Hello doctor!",
        "isRead": false,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "totalCount": 100,
    "hasMore": true
  },
  "message": "Messages retrieved successfully"
}
```

### 4. Send Message

**POST** `/api/chat/messages`

Sends a new message to a chat room.

**Request Body:**
```json
{
  "roomId": "room_id",
  "messageType": "text", // "text", "image", "file", "system"
  "content": "Hello!",
  "fileUrl": "https://example.com/file.jpg", // optional for file/image messages
  "fileName": "image.jpg", // optional
  "fileSize": 1024, // optional
  "mimeType": "image/jpeg", // optional
  "metadata": {
    "replyTo": "message_id" // optional
  }
}
```

**Response:**
```json
{
  "ok": true,
  "data": {
    "_id": "message_id",
    "roomId": "room_id",
    "senderId": "user_id",
    "senderType": "patient",
    "messageType": "text",
    "content": "Hello!",
    "isRead": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Message sent successfully"
}
```

### 5. Mark Messages as Read

**POST** `/api/chat/rooms/:roomId/mark-read`

Marks all unread messages in a room as read by the authenticated user.

**Response:**
```json
{
  "ok": true,
  "data": {
    "count": 5
  },
  "message": "Messages marked as read"
}
```

## Socket.IO Events

Connect to the Socket.IO endpoint with authentication token in the `auth.token` field.

### Connection
```javascript
const socket = io('http://localhost:4000', {
  auth: {
    token: 'jwt_token_here'
  }
});
```

### Client Events (Emit)

#### Join Rooms
```javascript
socket.emit('rooms:join', {
  roomIds: ['room_id_1', 'room_id_2']
});
```

#### Send Message
```javascript
socket.emit('message:send', {
  roomId: 'room_id',
  messageType: 'text',
  content: 'Hello!',
  fileData: { // optional for file messages
    fileUrl: 'https://example.com/file.jpg',
    fileName: 'image.jpg',
    fileSize: 1024,
    mimeType: 'image/jpeg'
  },
  metadata: { // optional
    replyTo: 'message_id'
  }
});
```

#### Typing Events
```javascript
// Start typing
socket.emit('typing:start', { roomId: 'room_id' });

// Stop typing
socket.emit('typing:stop', { roomId: 'room_id' });
```

#### Mark Messages as Read
```javascript
socket.emit('messages:mark-read', { roomId: 'room_id' });
```

### Server Events (Listen)

#### Room Events
```javascript
// Successfully joined rooms
socket.on('rooms:joined', (data) => {
  console.log('Joined rooms:', data.roomIds);
});
```

#### Message Events
```javascript
// New message received
socket.on('message:received', (message) => {
  console.log('New message:', message);
});

// Message send error
socket.on('message:error', (error) => {
  console.error('Message error:', error);
});
```

#### Typing Events
```javascript
socket.on('typing:update', (data) => {
  console.log(`${data.userName} is ${data.isTyping ? 'typing' : 'stopped typing'}`);
});
```

#### Read Status Events
```javascript
socket.on('messages:read', (data) => {
  console.log('Messages read by:', data.userId);
});
```

#### User Status Events
```javascript
// User came online
socket.on('user:online', (data) => {
  console.log('User online:', data.userId);
});

// User went offline
socket.on('user:offline', (data) => {
  console.log('User offline:', data.userId, 'Last seen:', data.lastSeen);
});

// User joined/left room
socket.on('user:room-online', (data) => {
  console.log('User joined room:', data);
});

socket.on('user:room-offline', (data) => {
  console.log('User left room:', data);
});
```

## Message Types

- **text**: Regular text message
- **image**: Image file with fileUrl
- **file**: Document/file with fileUrl  
- **system**: System-generated message (e.g., "User joined the chat")

## Error Handling

All API endpoints return errors in the format:
```json
{
  "ok": false,
  "error": "Error message here"
}
```

Socket.IO errors are emitted as:
```javascript
socket.on('error', (error) => {
  console.error('Socket error:', error.message);
});
```

## Authentication

All requests require a valid JWT token containing:
- `id`: User ID
- `userType`: "patient" or "doctor"
- `email`: User email

The token should be provided in:
- REST API: `Authorization: Bearer <token>`
- Socket.IO: `auth.token: <token>`