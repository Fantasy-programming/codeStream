const express = require('express');
const router = express.Router();
const flash = require('connect-flash');
router.use(flash());
const passport = require('passport');
const { body, validationResult } = require('express-validator');

// env variables
require('dotenv').config();

router.route("/login")
    .get(function (req, res, next) {
        res.render('login', { title: 'Login page' });
    });

router.post('/login', [
    body('email').isEmail().normalizeEmail().withMessage('Invalid email address'),
    body('password').notEmpty().withMessage('Empty Password')],
    function (req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render('login', {
                title: 'Login page',
                email: req.body.email,
                password: req.body.password,
                errorMessages: errors.array()
            });
        } else {
            passport.authenticate('local', {
                successRedirect: '/',
                failureRedirect: '/login',
                failureFlash: true
            }, function (err, user, info) {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    req.flash('message', 'Invalid email or password');
                    return res.redirect('/login');
                }
                req.logIn(user, function (err) {
                    if (err) {
                        return next(err);
                    }
                    return res.redirect('/');
                });
            })(req, res, next);
        }
    });


router.route("/register")
    .get(function (req, res, next) {
        res.render('register', { title: 'Register page' });
    });


router.post('/register', [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Invalid email address'),
    body('password').notEmpty().withMessage('Empty Password'),
    body('confirmPassword').notEmpty().withMessage('Passwords does not match')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match');
            }
            return true;
        }),
], async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('register', {
            title: 'Register page',
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword,
            errorMessages: errors.array()
        });
    } else {
        const user = new User();
        user.name = req.body.name;
        user.email = req.body.email;
        user.setPassword(req.body.password);
        try {
            await user.save();
            res.redirect('/login');
        } catch (err) {
            res.render('register', { errorMessages: err });
        }

    }
});

router.get('/logout', function (req, res) {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

module.exports = router;
