const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
// const bcrypt = require('bcryptjs');
const bcrypt = require('bcrypt');

const User = require('../model/User_model')



passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser((id, done) => {
    User.findById(id)
        .then((user) => {
            done(null, user)
        })
})


passport.use('user_local',
    new LocalStrategy(
        (username, password, done) => {

            User.findOne({ username: username }, (err, user) => {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    console.log("incorrect user name");
                    return done(null, false, { message: 'Incorrect username.' });
                }
                checkUser(username, password);

                async function checkUser(username, password) {
                    const match = await bcrypt.compare(password, user.password);
                    if (match) {
                        console.log("User is loging in ");
                        return done(null, user);
                    }
                    console.log("Password Incorrect ");
                    return done(null, false, { message: 'Password Incorrect ' })
                }
            })
        }

    ));