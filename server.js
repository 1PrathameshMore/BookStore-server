require('dotenv').config()
const express = require('express')
const path = require('path')
const app = express()
const { logger, logEvents } = require('./middleware/logger.js')
const errorHandler = require('./middleware/errorHandler.js')
const cors = require('cors')
const corsOptions = require('./config/corsOptions.js')
const connectDB = require('./config/dbConn.js')
const mongoose = require('mongoose')

const PORT = process.env.PORT || 5000;

connectDB();

app.use(logger);

app.use(cors(corsOptions));

app.use(express.json());

app.use(errorHandler);

app.use('/', express.static(path.join(__dirname, 'public')));// same as app.use(express.static('public'));

app.use('/', require('./routes/root'))
app.use('/auth', require('./routes/authRoutes.js'))
app.use('/author', require('./routes/authorRoutes.js'))
app.use('/book', require('./routes/bookRoutes.js'))
app.use('/category', require('./routes/categoryRoutes.js'))
app.use('/order', require('./routes/orderRoutes.js'))
app.use('/user', require('./routes/userRoutes.js'))

mongoose.connection.once('open', () => {
    console.log('Connected to Database');
    app.listen(PORT, () => {
        console.log(`Server ready to listen. Listening on port ${PORT}`);
    })
})