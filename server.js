const express = require('express');
const session = require('express-session');
const passport = require('passport');
const path = require('path');
const db = require('./models/db/db_config');

const app = express();

app.set('view engine', 'hbs');
express.static(path.join(__dirname, './views'));

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
    res.render('home.hbs');
});

app.get('/login', (req, res) => {
    res.render('login.hbs');
});

app.post('/login', (req, res) => {

});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});