var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// Serialize sessions
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findOne({ _id: id }).exec()
        .then(user => {
            done(null, user);
        })
        .catch(err => {
            done(err, null);
        });
});


// Use local strategy
passport.use(new LocalStrategy({
    usernameField: 'email'
},
    async function (username, password, done) {
        try {
            const user = await User.findOne({ email: username });
            if (!user) {
                return done(null, false, { message: 'Unknown user or password is incorrect' });
            }
            const isMatch = await user.validPassword(password);
            if (!isMatch) {
                return done(null, false, { message: 'Unknown user or password is incorrect' });
            }
            console.log(user);
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }
));