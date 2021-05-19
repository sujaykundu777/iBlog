import axios from 'axios';
import express from 'express';
import color from '../../utils/chalk.js';
import User from '../models/user.js';
import { fb_get_access_token_url } from '../security/facebookauth.js';
import { oAuth2Client } from '../security/googleauth.js';
const router = express.Router();

// Google Auth Callback
router.get('/google/callback', async (req, res) => {
    try {
        const code = req.query.code;
        console.log(color.yellow('code :' + code))

        if (code) {

            // get an access token based on our Oauth code
            const {
                tokens,
                err
            } = await oAuth2Client.getToken(code);
            if (err) {
                console.log('error fetching access token ', err);
            }

            if (tokens) {
                let user_email;
                let {
                    data,
                    error
                } = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`, {
                    headers: {
                        Authorization: `Bearer ${tokens.id_token}`
                    },
                });

                if (error) {
                    console.log('error', err);
                }

                user_email = data.email;

                let userObj = await User.findOne({
                    "email": user_email
                }, {
                    "username": 1,
                    "name": 1,
                    "email": 1
                }).lean();

                //redirect if user not found
                if(!userObj){
                    req.flash('info', 'Registration Required !')
                    res.redirect('/login');
                }
                // Save the details in the session
                req.session.authed = true;
                req.session.user = userObj;

                res.redirect('/dashboard');
            }
        } else {
            // if no code
            console.log('no code recieved');
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error.response.data || error.message
        });
    }
});

// Facebook Auth callback
router.get('/facebook/callback', async (req, res) => {
    try {
        const code = req.query.code;
        console.log(color.yellow('code :' + code))

        if (code) {
            let fb_get_token_url = await fb_get_access_token_url(code);
            let fb_access_token;

            // get an access token based on our Oauth code
            await axios.get(fb_get_token_url).then(res => {
                fb_access_token = res.data.access_token;
            }).catch((error) => {
                console.log('err', error);
                throw error;
            });

            if (fb_access_token) {
                let user_email;
                let {
                    data,
                    err
                } = await axios.get(`https://graph.facebook.com/me?fields=email&access_token=${fb_access_token}`);

                console.log('data', data);
                user_email = data.email;

                if (err) {
                    console.error(`Failed to fetch user`);
                }

                let userObj = await User.findOne({
                    "email": user_email
                }, {
                    "username": 1,
                    "name": 1,
                    "email": 1
                }).lean();

                // redirect if user not found
                if(!userObj){
                   req.flash('info','Registration required !');
                   res.redirect('/login');
                }

                // Save the details in the session
                req.session.authed = true;
                req.session.user = userObj;

                res.redirect('/dashboard');
            }
        } else {
            // if no code
            console.log('no code recieved');
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: err.response.data || err.message
        });
    }
});

export default router;