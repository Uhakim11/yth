
// ===================================================================================
// !! IMPORTANT: THIS IS AN EXTENDED MOCK/ILLUSTRATIVE SERVER.JS FILE !!
// ===================================================================================
// The "Youth Talent Hub" application, as defined in its metadata.json,
// is fundamentally a FRONTEND-ONLY DEMONSTRATION APPLICATION.
//
// This server.js file DOES NOT PROVIDE A FUNCTIONAL PRODUCTION BACKEND.
// It has been enhanced with more detailed (but still conceptual and illustrative)
// Express.js code to sketch out what backend endpoints MIGHT look like for
// features like real-time messaging, file uploads, calling, and admin CRUD.
//
// THIS SERVER IS NOT CONNECTED TO THE FRONTEND.
// All backend functionalities in the live demo are simulated client-side.
//
// Building a real, robust backend for these features is a significant project involving:
// - Real-time Communication: WebSockets (e.g., Socket.IO) for chat, WebRTC for calling (with a signaling server).
// - Databases: Persistent storage for users, messages, talents, slides, etc. (e.g., PostgreSQL, MongoDB).
// - Authentication & Authorization: Securely managing user identities and permissions.
// - File Storage: Robust solutions for media (e.g., AWS S3, Google Cloud Storage).
// - Scalability, Security, Error Handling, Input Validation, Logging, etc.
//
// Use this file for conceptual understanding and as a starting point for discussion
// if you were to build a real backend.
// ===================================================================================

console.log("Illustrative server.js loaded. This does not start a functional backend server.");
console.log("To run this example, you'd need Node.js, npm/yarn, and to install dependencies like express, cors, multer.");
console.log("The frontend is NOT configured to communicate with this server.");

// --- Illustrative Express.js Server Setup (Commented Out) ---
// See previous instructions on how to potentially run this (for isolated testing only).

/*
const express = require('express');
const cors =require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
// For a real chat/calling app, you'd use WebSockets:
// const http = require('http');
// const { Server } = require("socket.io");

const app = express();
const port = process.env.PORT || 3001;

// const server = http.createServer(app); // For Socket.IO
// const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- MOCK DATA STORES (In-Memory - For Illustration Only) ---
// In a real app, this data would live in a database.
let mockWelcomePageSlides = [
  { id: 'slide1', imageUrl: 'https://picsum.photos/seed/s1_server/1600/900', altText: 'Slide 1 Alt', title: 'Server Slide 1', subtitle: 'Subtitle 1 server' },
  { id: 'slide2', imageUrl: 'https://picsum.photos/seed/s2_server/1600/900', altText: 'Slide 2 Alt', title: 'Server Slide 2', subtitle: 'Subtitle 2 server' }
];
let mockServerTalents = [
  { id: 'talent_server_1', userId: 'user_server_1', name: 'Server Talent A', category: 'Tech', description: 'Backend dev specialist.', skills: ['Node.js', 'Databases'], profileImageUrl: 'https://picsum.photos/seed/talent_server_A/400/300', portfolio: [] },
  { id: 'talent_server_2', userId: 'user_server_2', name: 'Server Talent B', category: 'Art', description: 'Digital artist concept.', skills: ['Photoshop', 'Illustrator'], profileImageUrl: 'https://picsum.photos/seed/talent_server_B/400/300', portfolio: [] }
];
let mockServerUsers = [
    { id: 'user_server_1', email: 'user1@server.com', role: 'user', name: 'Server User One', status: 'active' },
    { id: 'user_server_2', email: 'user2@server.com', role: 'user', name: 'Server User Two', status: 'active' },
    { id: 'admin_server_1', email: 'admin@server.com', role: 'admin', name: 'Server Admin', status: 'active' }
];
let mockConversationsStore = { // Shared with messaging part below
  "conv_general_mock": [
    { id: "msg1_server_mock", senderId: mockServerUsers[0].id, senderName: mockServerUsers[0].name, content: "Hello from the mock server! This is Server User One.", type: 'text', timestamp: new Date(Date.now() - 120000).toISOString(), status: 'read' },
    { id: "msg2_server_mock", senderId: mockServerUsers[1].id, senderName: mockServerUsers[1].name, content: "Hi Server User One! User Two here, also from the mock server.", type: 'text', timestamp: new Date(Date.now() - 60000).toISOString(), status: 'read' }
  ]
};


// --- MOCK AUTHENTICATION & AUTHORIZATION MIDDLEWARE (Conceptual) ---
const mockAuthMiddleware = (req, res, next) => {
  // Simulate checking a token. For demo, assume a user is always "logged in".
  // In a real app, parse JWT from Authorization header, verify it, and attach user to req.
  const mockUserId = req.headers['x-mock-user-id'] || 'admin_server_1'; // Default to admin for easy testing of admin routes
  const user = mockServerUsers.find(u => u.id === mockUserId);

  if (!user) {
    console.warn("Mock Auth: No user found for x-mock-user-id, defaulting to admin_server_1.");
    req.user = mockServerUsers.find(u => u.id === 'admin_server_1');
  } else {
    req.user = user;
  }
  
  console.log(`Illustrative mockAuthMiddleware: Request by user ${req.user.id} (Role: ${req.user.role})`);
  next();
};

const mockAdminOnlyMiddleware = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    console.warn(`Illustrative mockAdminOnlyMiddleware: Access denied for user ${req.user.id} (Role: ${req.user.role})`);
    res.status(403).json({ error: "Forbidden: Admin access required." });
  }
};

// --- File Upload Setup (Illustrative Local Storage) ---
const uploadsDir = path.join(__dirname, 'uploads_server_mock_illustrative');
if (!fs.existsSync(uploadsDir)) {
  console.log(`Creating illustrative uploads directory: ${uploadsDir}`);
  fs.mkdirSync(uploadsDir, { recursive: true });
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage, limits: { fileSize: 25 * 1024 * 1024 } }); // 25MB limit

// Endpoint for file uploads (used by chat, talent profiles, slides etc.)
app.post('/api/upload', mockAuthMiddleware, upload.single('mediaFile'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }
  const publicFileUrl = `/uploads_server_mock_illustrative/${req.file.filename}`; // Conceptual URL
  console.log(`Illustrative: File "${req.file.originalname}" uploaded by ${req.user.id}, available at conceptual URL: ${publicFileUrl}`);
  res.status(201).json({
    message: 'File "uploaded" successfully (mock, saved to server disk illustratively).',
    fileName: req.file.originalname,
    fileUrl: publicFileUrl,
    mimeType: req.file.mimetype,
    size: req.file.size
  });
});
// Illustrative static serving for uploaded files
app.use('/uploads_server_mock_illustrative', express.static(uploadsDir));


// --- REAL-TIME MESSAGING (Conceptual Endpoints & WebSocket Comments) ---
// Real app: Use WebSockets (Socket.IO) for bi-directional communication.

// GET messages for a conversation
app.get('/api/messages/:conversationId', mockAuthMiddleware, (req, res) => {
  const { conversationId } = req.params;
  console.log(`GET /api/messages/${conversationId} (Illustrative) by user ${req.user.id}`);
  // DB Query: `const messages = await Message.find({ conversationId, participants: req.user.id }).sort('timestamp');`
  const messages = mockConversationsStore[conversationId] || [];
  res.json(messages);
});

// POST a new message
app.post('/api/messages/:conversationId', mockAuthMiddleware, (req, res) => {
  const { conversationId } = req.params;
  const { content, type = 'text', fileName, fileSize, fileUrl } = req.body; // fileUrl comes from /api/upload
  const senderId = req.user.id;

  if (!content && (type === 'text' || !fileUrl)) {
    return res.status(400).json({ error: 'Content or fileUrl is required.' });
  }

  const newMessage = {
    id: `server_msg_${Date.now()}`,
    senderId,
    senderName: req.user.name || senderId,
    content: (type === 'text' || type === 'system') ? content : fileUrl,
    type, fileName, fileSize,
    timestamp: new Date().toISOString(),
    status: 'sent'
  };

  if (!mockConversationsStore[conversationId]) mockConversationsStore[conversationId] = [];
  mockConversationsStore[conversationId].push(newMessage);
  // DB Insert: `const savedMessage = await new Message(newMessage).save();`
  // WebSocket Broadcast: `io.to(conversationId).emit('newMessage', savedMessage);`
  console.log(`Illustrative message from ${senderId} to ${conversationId}. Content/URL: ${newMessage.content}`);
  res.status(201).json(newMessage);
});

// --- REAL-TIME CALLING (Conceptual Signaling Endpoints) ---
// Real app: WebRTC signaling via WebSockets.
let activeCalls = {}; // callId: { callerId, calleeId, offerSdp, answerSdp, status, iceCandidates: { caller: [], callee: [] } }

app.post('/api/call/initiate', mockAuthMiddleware, (req, res) => {
  const { calleeId, offerSdp } = req.body;
  const callerId = req.user.id;
  const callId = `call_mock_${Date.now()}`;
  activeCalls[callId] = { callerId, calleeId, offerSdp, status: 'initiated', iceCandidates: {} };
  // WebSocket Emit: `io.to(calleeSocketId).emit('incomingCall', { callId, callerId, offerSdp });`
  console.log(`Illustrative: Call initiated by ${callerId} to ${calleeId}. Call ID: ${callId}`);
  res.json({ success: true, callId });
});

app.post('/api/call/answer', mockAuthMiddleware, (req, res) => {
  const { callId, answerSdp } = req.body;
  const calleeId = req.user.id;
  if (activeCalls[callId] && activeCalls[callId].calleeId === calleeId) {
    activeCalls[callId].answerSdp = answerSdp;
    activeCalls[callId].status = 'answered';
    // WebSocket Emit: `io.to(callerSocketId).emit('callAnswered', { callId, answerSdp });`
    console.log(`Illustrative: Call ${callId} answered by ${calleeId}.`);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Call not found or invalid callee.' });
  }
});

app.post('/api/call/reject', mockAuthMiddleware, (req, res) => {
  const { callId } = req.body;
  const userId = req.user.id;
  if (activeCalls[callId]) {
    const call = activeCalls[callId];
    const otherPartyId = call.callerId === userId ? call.calleeId : call.callerId;
    activeCalls[callId].status = 'rejected';
    // WebSocket Emit: `io.to(otherPartySocketId).emit('callRejected', { callId });`
    console.log(`Illustrative: Call ${callId} rejected by ${userId}. Other party: ${otherPartyId}`);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Call not found.' });
  }
});

app.post('/api/call/ice-candidate', mockAuthMiddleware, (req, res) => {
  const { callId, candidate } = req.body;
  const userId = req.user.id;
  if (activeCalls[callId]) {
    const call = activeCalls[callId];
    const targetId = call.callerId === userId ? call.calleeId : call.callerId;
    // WebSocket Emit: `io.to(targetSocketId).emit('iceCandidate', { candidate });`
    console.log(`Illustrative: ICE candidate from ${userId} for call ${callId} (to ${targetId}).`);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Call not found.' });
  }
});

app.post('/api/call/end', mockAuthMiddleware, (req, res) => {
  const { callId } = req.body;
  const userId = req.user.id;
  if (activeCalls[callId]) {
    const call = activeCalls[callId];
    const otherPartyId = call.callerId === userId ? call.calleeId : call.callerId;
    // WebSocket Emit: `io.to(otherPartySocketId).emit('callEnded', { callId });`
    delete activeCalls[callId];
    console.log(`Illustrative: Call ${callId} ended by ${userId}. Other party: ${otherPartyId}`);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Call not found.' });
  }
});


// --- ADMIN DASHBOARD - CRUD OPERATIONS (Illustrative) ---
// All admin routes should be protected by mockAdminOnlyMiddleware

// Slides CRUD
app.get('/api/admin/slides', mockAuthMiddleware, mockAdminOnlyMiddleware, (req, res) => {
  console.log('GET /api/admin/slides (Illustrative)');
  // DB Query: `const slides = await Slide.find({});`
  res.json(mockWelcomePageSlides);
});

app.post('/api/admin/slides', mockAuthMiddleware, mockAdminOnlyMiddleware, (req, res) => {
  const { imageUrl, altText, title, subtitle } = req.body; // Expects file to be uploaded separately, imageUrl provided from /api/upload
  if (!imageUrl || !altText) return res.status(400).json({ error: 'imageUrl and altText required for slide.' });
  const newSlide = { id: `slide_server_${Date.now()}`, imageUrl, altText, title, subtitle };
  mockWelcomePageSlides.push(newSlide);
  // DB Insert: `const savedSlide = await new Slide(newSlide).save();`
  console.log(`Illustrative: New slide added by admin ${req.user.id}. Title: ${title}`);
  res.status(201).json(newSlide);
});

app.put('/api/admin/slides/:slideId', mockAuthMiddleware, mockAdminOnlyMiddleware, (req, res) => {
  const { slideId } = req.params;
  const { imageUrl, altText, title, subtitle } = req.body;
  const slideIndex = mockWelcomePageSlides.findIndex(s => s.id === slideId);
  if (slideIndex === -1) return res.status(404).json({ error: 'Slide not found.' });
  
  const updatedSlide = { ...mockWelcomePageSlides[slideIndex], imageUrl, altText, title, subtitle };
  mockWelcomePageSlides[slideIndex] = updatedSlide;
  // DB Update: `const savedSlide = await Slide.findByIdAndUpdate(slideId, req.body, { new: true });`
  console.log(`Illustrative: Slide ${slideId} updated by admin ${req.user.id}.`);
  res.json(updatedSlide);
});

app.delete('/api/admin/slides/:slideId', mockAuthMiddleware, mockAdminOnlyMiddleware, (req, res) => {
  const { slideId } = req.params;
  const initialLength = mockWelcomePageSlides.length;
  mockWelcomePageSlides = mockWelcomePageSlides.filter(s => s.id !== slideId);
  if (mockWelcomePageSlides.length < initialLength) {
    // DB Delete: `await Slide.findByIdAndDelete(slideId);`
    console.log(`Illustrative: Slide ${slideId} deleted by admin ${req.user.id}.`);
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Slide not found.' });
  }
});

// Talents CRUD (by Admin)
app.get('/api/admin/talents', mockAuthMiddleware, mockAdminOnlyMiddleware, (req, res) => {
  console.log('GET /api/admin/talents (Illustrative)');
  // DB Query: `const talents = await Talent.find({});`
  res.json(mockServerTalents);
});

app.post('/api/admin/talents', mockAuthMiddleware, mockAdminOnlyMiddleware, (req, res) => {
  const { userId, name, category, description, skills, profileImageUrl } = req.body; // profileImageUrl from /api/upload
  if (!userId || !name || !category) return res.status(400).json({ error: 'userId, name, category required.' });
  // Check if user with userId exists
  // const userExists = mockServerUsers.some(u => u.id === userId);
  // if (!userExists) return res.status(400).json({ error: `User with ID ${userId} not found.`});

  const newTalent = { id: `talent_server_${Date.now()}`, userId, name, category, description, skills: skills || [], profileImageUrl, portfolio: [] };
  mockServerTalents.push(newTalent);
  // DB Insert: `const savedTalent = await new Talent(newTalent).save();`
  console.log(`Illustrative: New talent profile for user ${userId} created by admin ${req.user.id}. Name: ${name}`);
  res.status(201).json(newTalent);
});

app.put('/api/admin/talents/:talentId', mockAuthMiddleware, mockAdminOnlyMiddleware, (req, res) => {
  const { talentId } = req.params;
  const talentIndex = mockServerTalents.findIndex(t => t.id === talentId);
  if (talentIndex === -1) return res.status(404).json({ error: 'Talent not found.' });
  
  // Fields that admin can update (example)
  const { name, category, description, skills, profileImageUrl, status /* e.g. 'approved', 'pending', 'rejected' */ } = req.body;
  const updatedTalent = { 
    ...mockServerTalents[talentIndex], 
    name: name || mockServerTalents[talentIndex].name,
    category: category || mockServerTalents[talentIndex].category,
    description: description || mockServerTalents[talentIndex].description,
    skills: skills || mockServerTalents[talentIndex].skills,
    profileImageUrl: profileImageUrl || mockServerTalents[talentIndex].profileImageUrl,
    // status: status || mockServerTalents[talentIndex].status // If talents have a status field
  };
  mockServerTalents[talentIndex] = updatedTalent;
  // DB Update: `const savedTalent = await Talent.findByIdAndUpdate(talentId, req.body, { new: true });`
  console.log(`Illustrative: Talent ${talentId} updated by admin ${req.user.id}.`);
  res.json(updatedTalent);
});

app.delete('/api/admin/talents/:talentId', mockAuthMiddleware, mockAdminOnlyMiddleware, (req, res) => {
  const { talentId } = req.params;
  const initialLength = mockServerTalents.length;
  mockServerTalents = mockServerTalents.filter(t => t.id !== talentId);
  if (mockServerTalents.length < initialLength) {
    // DB Delete: `await Talent.findByIdAndDelete(talentId);`
    console.log(`Illustrative: Talent ${talentId} deleted by admin ${req.user.id}.`);
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Talent not found.' });
  }
});

// Users Management (by Admin) - "Talenters"
app.get('/api/admin/users', mockAuthMiddleware, mockAdminOnlyMiddleware, (req, res) => {
  console.log('GET /api/admin/users (Illustrative)');
  // DB Query: `const users = await User.find({}, '-password'); // Exclude password field`
  res.json(mockServerUsers.map(u => ({ id: u.id, name: u.name, email: u.email, role: u.role, status: u.status }))); // Don't send sensitive data
});

app.put('/api/admin/users/:userId/status', mockAuthMiddleware, mockAdminOnlyMiddleware, (req, res) => {
  const { userId } = req.params;
  const { status } = req.body; // Expect 'active' or 'suspended'
  if (!['active', 'suspended'].includes(status)) return res.status(400).json({ error: 'Invalid status value.'});
  
  const userIndex = mockServerUsers.findIndex(u => u.id === userId);
  if (userIndex === -1) return res.status(404).json({ error: 'User not found.' });
  if (mockServerUsers[userIndex].id === req.user.id) return res.status(403).json({ error: "Admin cannot change their own status."});

  mockServerUsers[userIndex].status = status;
  // DB Update: `const updatedUser = await User.findByIdAndUpdate(userId, { status }, { new: true }).select('-password');`
  console.log(`Illustrative: User ${userId} status changed to ${status} by admin ${req.user.id}.`);
  res.json(mockServerUsers[userIndex]);
});

app.put('/api/admin/users/:userId/role', mockAuthMiddleware, mockAdminOnlyMiddleware, (req, res) => {
  const { userId } = req.params;
  const { role } = req.body; // Expect 'user' or 'admin'
  if (!['user', 'admin'].includes(role)) return res.status(400).json({ error: 'Invalid role value.'});

  const userIndex = mockServerUsers.findIndex(u => u.id === userId);
  if (userIndex === -1) return res.status(404).json({ error: 'User not found.' });
  if (mockServerUsers[userIndex].id === req.user.id && role !== 'admin') return res.status(403).json({ error: "Admin cannot demote themselves."});

  mockServerUsers[userIndex].role = role;
  // DB Update: `const updatedUser = await User.findByIdAndUpdate(userId, { role }, { new: true }).select('-password');`
  console.log(`Illustrative: User ${userId} role changed to ${role} by admin ${req.user.id}.`);
  res.json(mockServerUsers[userIndex]);
});


// --- Other General Endpoints ---
app.get('/api/sample-data', (req, res) => {
  console.log('GET /api/sample-data (Illustrative)');
  res.json({ message: 'Hello from the illustrative backend!', data: [{ id: 1, name: 'Sample Uno' }] });
});

app.post('/api/echo', (req, res) => {
  console.log('POST /api/echo (Illustrative) with body:', req.body);
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: 'Request body cannot be empty.' });
  }
  res.json({ message: 'Echoed from server!', receivedData: req.body });
});

// Global error handler (Conceptual)
// app.use((err, req, res, next) => {
//   console.error("Illustrative Global Error Handler:", err.stack);
//   // Add input validation error specific handling
//   // Add database error specific handling
//   res.status(err.statusCode || 500).json({ error: err.message || 'Something broke on the server (illustrative)!' });
// });

// Start server
app.listen(port, () => {
  console.log(`Illustrative Express server listening on http://localhost:${port}`);
  console.log("======================================================================");
  console.log("REMEMBER: THIS IS A MOCK SERVER. THE FRONTEND IS NOT CONNECTED TO IT.");
  console.log("This server only prints to console and uses in-memory data for illustration.");
  console.log("For a real application, integrate a database, proper authentication, WebSockets, etc.");
  console.log("======================================================================");
});


