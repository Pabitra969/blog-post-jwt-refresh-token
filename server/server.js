const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
//this is for the .env file
const dotenv = require('dotenv')
dotenv.config()
//getting the port from the .env file
const PORT = process.env.PORT;

// Database initialization
const { initializeDb } = require('./config/db');
initializeDb();

// Importing user routes
const userRoutes = require('./routes/userRoutes');
const blogRoutes = require('./routes/blogRoutes');

const cookieParser = require('cookie-parser');


const userControllers = require('./controllers/userControllers');



// cors middleware
const corsOptions = {
  origin: ['http://20.197.14.144'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, 
  optionsSuccessStatus: 200, 
};

app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


//user routes

app.use('/users', userRoutes);
// app.use('/blogs', blogRoutes);
app.use('/blogs',blogRoutes)

app.post('/refresh', userControllers.refreshToken);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});