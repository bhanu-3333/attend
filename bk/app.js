const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./Routes/authRoutes');
const atdRoutes = require('./Routes/attendanceRoutes');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cookieParser());

// Set CORS options to allow requests from your frontend and include credentials
app.use(cors({
  origin: 'http://localhost:5173', // your frontend URL
  credentials: true,
}));

app.use('/api', authRoutes, atdRoutes);

mongoose.connect('mongodb+srv://naveen:95144@cluster0.ij3t1.mongodb.net/')
  .then(() => {
    console.log('database connected');
  })
  .catch((error) => {
    console.log(error);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
