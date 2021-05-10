const qs = require('qs');

export const loginUrl = () => {
    const redirectUriParameters = {
        client_id: process.env.REACT_APP_SPOTIFY_CLIENT_ID,
        redirect_uri: `http://localhost:3000/callback/`,
        scope: "playlist-modify-public",
        response_type: 'code',
        show_dialog: true,
    }
    const idk = `https://accounts.spotify.com/authorize?${qs.stringify(redirectUriParameters)}`;
    return idk
}