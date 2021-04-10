const router = require('express').Router();
const passport = require('passport')
const bodyParser = require('body-parser')
const saltRounds = 10;
const bcrypt = require('bcrypt');



function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error_msg', 'Please log in to view that resource');
    res.redirect('/user/login');
}


const User = require('../model/User_model')

router.get('/login', (req, res) => {
    res.render('login')
})

router.post('/login', (req, res, next) => {

    passport.authenticate('user_local', {
        successRedirect: '/user/dashboard',
        failureRedirect: '/user/login',
        failureFlash: true,
    })(req, res, next);

})


router.get('/register', (req, res) => {
    res.render('register')
})

router.post('/register', (req, res) => {
    const { name, username, gender, password, password2 } = req.body;
    let errors = [];

    if (password != password2) {
        errors.push({ msg: 'Passwords do not match' });

    }

    if (password.length < 6) {
        errors.push({ msg: 'Password must be at least 6 characters' });

    }
    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            username,
            password,
            password2
        });
    } else {
        User.findOne({ username: username }).then(user => {

            if (user) {

                errors.push({ msg: 'User with entered username already exists,try using another username' })

                res.render('register', {
                    errors,
                    name,
                    username,
                    password,
                    password2
                });
            } else {

                const newUser = new User({
                    name,
                    username,
                    password,
                    gender
                });

                bcrypt.hash(password, saltRounds, function (err, hash) {
                    if (err) {
                        throw (err)
                    }
                    newUser.password = hash;

                    newUser
                        .save()
                        .then(user => {
                            req.flash('success_msg', 'You are now registered and can login');
                            res.redirect('/user/login')
                        })
                        .catch(err => console.log(err))
                });

            }


        })
            .catch(err => {
                console.log(err)
            })

    }
})


router.get('/dashboard', ensureAuthenticated, (req, res) => {
    res.render('dashboard', {
        name: req.user.name
    });
})

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/user/login');

})

module.exports = router;