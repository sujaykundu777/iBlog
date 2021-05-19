import express from 'express';
import { hashPassword, verifyPassword } from '../../utils/auth.js';
import User from '../models/user.js';

const router = express.Router();

// Registration
router.post('/register', async (req, res, next) => {

    const {username, name, email, password} = req.body;

    // hash password before saving to db
    let hashedPassword = await hashPassword(password);

    // check if email already exists
    let isExistingUser = await User.findOne({"email": email});
    if(isExistingUser){
        req.flash('info', 'Failed to register ! Existing user');
        res.redirect('/register');
    }

    // create new user object
    const newUser = new User({
        username: username,
        name: name,
        email: email,
        password: hashedPassword
    });

    let response;
    // create new user
     await newUser.save().then(data => {
            req.flash('info', 'Registration Successful, Please Login !');
            res.redirect('/register');
         }).catch(err => {
            req.flash('info', err.message);
            throw err;
           // res.redirect('/register');
      });
});

// Login API using form
router.post('/login', async (req, res) => {
    const {username, password} = req.body;

    let userdetails;

    // check if user exists
    await User.findOne({username: username}).then(user => {
            userdetails = user;
    }).catch(err => {
            req.flash('info', 'Failed to login, User not found !')
            res.redirect('/login');
    });

    // check if existing user
    if(userdetails){
        let isExistingUser = await verifyPassword(password, userdetails.password);
        if(isExistingUser){

            // set auth to true
            req.session.authed = true;
            //  store logged in user data in session
            req.session.user = {
                'username': userdetails.username,
                'email': userdetails.email,
                'name': userdetails.name
            }

            req.flash('info', 'Authentication Successful !')
            res.redirect('/dashboard');

        }else{
             //     console.error('Passwords do not match')
                req.session.authed = false;
                req.flash('info', "Authentication Failed, Incorrect Password !")
                res.redirect('/login');
        }
    }else{
        req.flash('info', "Authentication Failed, Incorrect Password !")
        res.redirect('/login');
    }

});



export default router;