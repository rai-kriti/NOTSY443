const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors({
  origin: [
    "https://myai-project-kt3e.vercel.app", // your Vercel frontend
                    // local dev
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));


app.use(express.json());

// Connect routes BEFORE app.listen
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const noteRoutes = require('./routes/noteRoutes');
app.use('/api/notes', noteRoutes);



app.get('/', (req, res) => {
  res.send('API is running');
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}).catch(err => console.log(err));


app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});
