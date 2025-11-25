import express from 'express';

const app = express();

app.get('/test', (req, res) => {
  console.log('Request received');
  res.json({ message: 'Hello World' });
});

app.listen(4000, () => {
  console.log('Server running on port 4000');
});
