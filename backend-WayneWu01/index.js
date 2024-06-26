const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const connectionString = 'mongodb+srv://zw85:ixY1Fr3dECBf7hZf@cluster0.auxuzqi.mongodb.net/?retryWrites=true&w=majority';
const mongoose = require('mongoose');
const enableCORS = (req, res, next) => {
    res.header('Access-Control-Allow-Origin',req.headers.origin)
    res.header('Access-Control-Allow-Credentials',true)
    res.header('Access-Control-Allow-Headers','Authorization, Content-Type, Origin, X-Requested-With, Accept, X-Session-Id')
    res.header('Access-Control-Allow-Methods','GET, POST, PUT, DELETE')
    res.header('Access-Control-Expose-Headers', 'Location, X-Session-Id')
    if(req.method == 'OPTIONS'){
        res.status(200).send('OK')
    } else {
        next()
    }
}

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
app.use(enableCORS);


require('./src/auth')(app);
require('./src/articles')(app);
require('./src/profile')(app);
require('./src/following')(app);
mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));



// Get the port from the environment, i.e., Heroku sets it
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    const addr = server.address();
    console.log(`Server listening at http://${addr.address}:${addr.port}`)
});
