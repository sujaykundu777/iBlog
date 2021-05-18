import * as qs from 'query-string';
// Facebook authentication
const CLIENT_ID = process.env.facebook_app_id;
const REDIRECT_URI = process.env.facebook_auth_redirect_uri;
const CLIENT_SECRET = process.env.facebook_app_secret;

const params = qs.stringify({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    scope: ['email'].join(','),
    response_type: 'code',
    auth_type: 'rerequest',
    display: 'popup',
  });

const fb_auth_url = `https://www.facebook.com/v10.0/dialog/oauth?${params}`;

// oauth2fbClient
const fb_get_access_token_url = (code) => {
    let fb_oauth_uri = `https://graph.facebook.com/v10.0/oauth/access_token?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&client_secret=${CLIENT_SECRET}&code=${encodeURIComponent(code)}`;
    return fb_oauth_uri;
}

export { fb_auth_url, fb_get_access_token_url };

