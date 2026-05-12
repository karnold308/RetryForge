
require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');
const { pool } = require('./config/dbConn');


const dns = require('node:dns');
dns.setServers(['8.8.8.8', '8.8.4.4']); 

const PORT = process.env.PORT || 3500;

// connectDB();

// custom middleware logger
app.use(logger);

// handle options credentials check - before CORS
// and fetch cookies credentials reqiurement
app.use(credentials);

// cross origin resource sharing
app.use(cors(corsOptions));


// built-in middleware to handle urlencoded data,
// in other words, form-data:
// 'content-type: application/x-www-form-urlencoded'
app.use(express.urlencoded({ extended: false}));

// built-in middleware for json
app.use(express.json());

// middleware for cookies
app.use(cookieParser());

// serve static files
// app.use(express.static(path.join(__dirname, '/public')));

// routes
// works like waterfall, everything after each line uses
// what was setup above it
// app.use('/', require('./routes/root'));
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));



// dont want JWT on register or auth
app.use(verifyJWT);
// app.use('/employees', require('./routes/api/employees'));


// Regex no longer works like this in Express 5
// app.get('^/$|/index(.html)?', (req, res) => {
/* app.get('/', (req, res) => {
    // res.sendFile('./views/index.html', { root: __dirname });
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});


app.get('/new-page.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'new-page.html'));
});

app.get('/old-page.html', (req, res) => {
    res.redirect(301, '/new-page.html'); // 302 by default, need 301
});
 */
/* 
// route handling before learning Express
// route handlers, chained 
app.get('/hello.html', (req,res, next) => {
    console.log('attempted to load hello.html');
    next()
}, (req, res) => {
    res.send('hello')
})

// chain route handlers
const one = (req, res, next) => {
    console.log('one');
    next();
}

const two = (req, res, next) => {
    console.log('two');
    next();
}

const three = (req, res, next) => {
    console.log('three');
    res.send('finished')
}

app.get('/chain', [one, two,three]);

 */


// app.use('/')
/* app.all('{*splat}', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json( {error: "404 page not found" });
    } else {
        res.type('txt').send("404 not found");
    }
}) 
    */

app.use(errorHandler);



pool.connect()
.then(() => {
    console.log('Connected to postgresql DB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

}).catch(() => {
    console.log("can't connect to db")
})

