var express = require('express');
var router = express.Router();
var passport = require('passport');
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
        var user = new User();
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

module.exports = router;
