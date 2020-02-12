const express = require('express');
const session = require('express-session');
const passport = require('passport');
const path = require('path');

const app = express();
app.use(express.urlencoded({extended: false}));
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

const port = 3000;

app.get('/', (req, res) => {
    res.send('Test');
});

app.get('/login', (req, res) => {

});

app.post('/login', (req, res) => {

});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});