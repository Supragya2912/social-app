const express = require('express');
const app = express();
const session = require('express-session');
require('dotenv').config();
const PORT = process.env.PORT || 8000
const connectToDB = require('./db')
const cors = require('cors')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('./utils/logger');


connectToDB();


app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(logger)

app.use(
    cors({
        origin: 'http://localhost:3000',
        credentials: true
    })
)

app.get('/ping', (req, res) => {
    res.send('pong');
});

app.use('/api/auth',require('./routes/auth'));
app.use('/api/posts',require('./routes/posts'));
app.use('/api/users',require('./routes/users'));


app.listen(PORT, (err, res) => {
    if (err) {
        console.log('Error: ', err);
    }
    console.log(`Server is running on port ${PORT}`);
});
