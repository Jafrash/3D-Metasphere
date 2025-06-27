import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));
app.use(express.json());

// Mock data
let spaces = [
  {
    id: '1',
    name: 'Default Space',
    width: 1000,
    height: 1000,
    thumbnail: null,
    creatorId: '1'
  }
];

// API endpoints
app.get('/api/spaces', (req, res) => {
  res.json(spaces);
});

app.post('/api/spaces', (req, res) => {
  const newSpace = {
    id: Date.now().toString(),
    ...req.body,
    thumbnail: null,
    creatorId: '1'
  };
  spaces.push(newSpace);
  res.status(201).json(newSpace);
});

// Authentication endpoints
let users = [];

app.post('/api/v1/signup', (req, res) => {
  const { username, password } = req.body;
  
  // Check if user already exists
  const existingUser = users.find(u => u.username === username);
  if (existingUser) {
    return res.status(400).json({ error: 'Username already exists' });
  }

  // Create new user
  const user = {
    id: Date.now().toString(),
    username,
    password, // In a real app, you should hash the password
    type: 'admin'
  };
  users.push(user);
  
  res.status(200).json({ message: 'Signup successful' });
});

app.post('/api/v1/signin', (req, res) => {
  const { username, password } = req.body;
  
  // Find user
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Generate token (in a real app, use JWT or similar)
  const token = 'your-secure-token-' + Date.now();
  
  res.json({ token });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
