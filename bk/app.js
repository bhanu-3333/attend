const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./Routes/authRoutes');
const cookieParser = require('cookie-parser')

const cors = require('cors')

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors())

app.use('/api', authRoutes);

mongoose.connect('mongodb+srv://naveen:95144@cluster0.ij3t1.mongodb.net/').then ( () =>{
    console.log('database connected');
}) .catch((error) =>{
    console.log(error)
} )

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
    });
