const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
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

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
