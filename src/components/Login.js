import React from 'react'
import { observer, inject } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles';
import { loginUrl } from './LoginUrl'

const useStyles = makeStyles({
    login: {
        marginTop: '50px',
    
        '& a': {
            padding: '20px',
            margin: '20px',
            borderRadius: '99px',
            backgroundColor: '#1db978',
            fontWeight: 600,
            // backgroundColor: 'black',
            color: 'white',
            textDecoration: 'none',
        },

        '& a:hover': {
            backgroundColor: ' white',
            borderColor: '#1db954',
            color: '#1db954',
        }
    },
});


const Login = inject("home")(observer((props) => {
    const classes = useStyles()

    return (
        <div className={classes.login}>
            <a className="playlistBtns" onClick={() => props.home.day(loginUrl())} >CREATE PLAYLIST</a>
            <a className="playlistBtns" onClick={() => window.location.reload()} >START OVER</a>
        </div>
    )
}));

export default Login