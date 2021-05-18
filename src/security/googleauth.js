import { google } from 'googleapis';

// google auth project oauth client credentials
const CLIENT_ID = process.env.google_auth_client_id;
const CLIENT_SECRET = process.env.google_auth_client_secret;
const REDIRECT_URL = process.env.google_auth_redirect_uri;

// iniitalize a new oAuth 2 client
const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);

// get auth url
const google_auth_url = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
});

// const fetched_google_user = async ( res) => {

//     let fetched_tokens = req.session.tokens;
//     console.log('fetched_tokens', fetched_tokens)
//     let userData;

//     await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${fetched_tokens.access_token}`, {
//         headers: {
//             Authorization: `Bearer ${fetched_tokens.id_token}`
//         },
//     }).then((res) => {
//         let data = res.data;
//         console.log('data', data);

//         let userObj = {
//             'name': data.name,
//             'email': data.email,
//             'username': (data.given_name + "_" + data.family_name).toLowerCase()
//         };

//         console.log('user_obj', userObj);

//         // Save the details in the session
//         req.session.authed = true;
//         req.session.user = userObj;
//         userData = userObj;

//     })
//     .catch((error) => {
//         console.error(`Failed to fetch user`);
//         throw error;
//     });

//     return userData;
// }

export { oAuth2Client, google_auth_url };

