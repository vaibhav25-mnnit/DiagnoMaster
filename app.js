const express = require('express')
const fetch = require('node-fetch')
const bodyParser = require('body-parser');
const { json } = require('body-parser');
const cookiesession = require('cookie-session')
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

require('dotenv').config()

const app = express();

const passport_local = require('./config/passport_local')


app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));

app.set('view engine', 'ejs')

const PORT = process.env.PORT || 5000;



//Establishing connection with database(mongodb)
mongoose.connect(process.env.MONGODB_CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true }
).then(() => console.log('Connected to database...'))
    .catch(err => console.log(err));

const User = require('./model/User_model')

app.use(cookiesession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.SESSON_SECRET]
}))


//Express session
app.use(
    session({
        secret: [process.env.SESSON_SECRET],
        resave: true,
        saveUninitialized: true,
    })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());



// Connect flash
app.use(flash());


const { ensureAuthenticated } = require('./config/check_user')



// Global variables
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});



const user = require('./routes/user_routes')




app.get('/', (req, res) => {
    res.render('home')
})



app.get('/diagnose', ensureAuthenticated, (req, res) => {
    res.render('diagnose')
})

app.post('/diagnose', async (req, res) => {

    const temp_ID = req.body.IDs.split(',');
    let int_ID = [];
    for (let index = 0; index < temp_ID.length; index++) {
        int_ID.push(parseInt(temp_ID[index]));
    }
    const final_ID = JSON.stringify(int_ID)
    const fetch_URL = `https://healthservice.priaid.ch/diagnosis?symptoms=${final_ID}&gender=${req.body.gender}&year_of_birth=${req.body.Age}&token=${process.env.APIMEDIC_TOKEN}&format=json&language=en-gb`
    const response = await fetch(fetch_URL);
    const data = await response.json();
    console.log(data)
    res.render('diseases', { Data: data });
});



app.use('/user', user);


app.listen(PORT, () => {
    console.log(`Listening at port ${PORT}`)
})

