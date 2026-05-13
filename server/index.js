const dotenv = await import('dotenv');
dotenv.default.config();
import express from 'express';
const app = express();
const path = import('path');
import cors from 'cors';
const { errorHandler } = await import('./middleware/errorHandler.js');
const { logger } = await import('./middleware/logEvents.js');
const corsOptions = import('./config/corsOptions.js');
const { credentials } = await import('./middleware/credentials.js');
import  { pool, test } from './config/dbConn.js';
import cookieParser from 'cookie-parser';
import dns from 'node:dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);
const { verifyJWT } = await import('./middleware/verifyJWT.js');

import { router as register } from './routes/register.js'
import { router as auth } from './routes/auth.js'
import { router as refresh } from './routes/refresh.js'
import { router as logout } from './routes/logout.js'

const PORT = process.env.PORT || 3500;



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
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

// middleware for cookies
app.use(cookieParser());

// serve static files
// app.use(express.static(path.join(__dirname, '/public')));

// routes
// works like waterfall, everything after each line uses
// what was setup above it
// app.use('/', import('./routes/root'));
app.use('/register', register);
app.use('/auth', auth);
app.use('/refresh', refresh);
app.use('/logout', logout);



// dont want JWT on register or auth
app.use(verifyJWT);
// app.use('/employees', import('./routes/api/employees'));


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


test()
pool.connect()
    .then(() => {
        console.log('Connected to postgresql DB');
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

    }).catch((err) => {
        console.log(err)
        console.log("can't connect to db")
    })


export default app;