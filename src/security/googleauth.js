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


export { oAuth2Client, google_auth_url };

