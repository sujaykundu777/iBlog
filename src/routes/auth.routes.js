import express from 'express';
import { hashPassword, verifyPassword } from '../../utils/auth.js';
import User from '../models/user.js';

const router = express.Router();

// Registration
router.post('/register', async (req, res, next) => {

    const {username, name, email, password} = req.body;

    // hash password before saving to db
    let hashedPassword = await hashPassword(password);

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
            //  res.status(200).send({
            //      success: true,
            //      message: 'registration successful',
            //      data: data
            //  });
            res.redirect('/login');
         }).catch(err => {
                res.status(400).send({
                    success: false,
                    message: err.message
                });
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
            console.log('User not found');
            return res.status(400).send({
                "success": "false",
                "message": "Authentication Failed !",
                "error": "No user found with the username, Please try again"
            });
    });

    // check if existing user
    if(userdetails){
        let isExistingUser = await verifyPassword(password, userdetails.password);
        if(isExistingUser){

            // return res.status(200).send({
            //             "success": true,
            //             "message": "Authentication Successful",
            //             "user": userdetails
            // });

            // set auth to true
            req.session.authed = true;
            //  store logged in user data in session
            req.session.user = {
                'username': userdetails.username,
                'email': userdetails.email,
                'name': userdetails.name
            }

            return res.redirect('/dashboard');

        }else{
             //     console.error('Passwords do not match')
                req.session.authed = false;
                return res.status(500).send({
                    "success": "false",
                    "message": "Authentication Failed !",
                    "error": "Incorrect Password !"
                })
        }
    }else{
        console.log('User not found');
        return res.status(400).send({
            "error": "No user found, Please try again"
        });
    }

});



export default router;