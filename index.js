const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/goldRates', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define a schema for gold rate data
const goldRateSchema = new mongoose.Schema({
  date: String,
  rate: Number,
});

const GoldRate = mongoose.model('GoldRate', goldRateSchema);

// API endpoint for calculating today's gold rate
app.get('/api/goldRate', async (req, res) => {
  try {
    // Retrieve today's gold rate from the database
    const today = new Date().toISOString().split('T')[0];
    const todayGoldRate = await GoldRate.findOne({ date: today });

    if (todayGoldRate) {
      res.json({ date: todayGoldRate.date, rate: todayGoldRate.rate });
    } else {
      res.status(404).json({ error: 'Today\'s gold rate not available' });
    }
  } catch (error) {
    console.error('Error fetching today\'s gold rate:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
