import React, { useState, useEffect } from 'react'
import { observer, inject } from 'mobx-react'
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';

function Alert(props) {
  return <MuiAlert elevation={16} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    // width: '100%',
    padding: '300px 100px',
    fontSize: 'x-large',
    // padding

    // '& > * + *': {
    //   marginTop: '5rem',
    // },
  },
}));

// const Dashboard = ({ code }) => {
const Dashboard = inject("home")(observer((props) => {
  const classes = useStyles();
  const [severity, setSeverity] = useState({severity: "error", message: "Access was denied."})
  const code = new URLSearchParams(window.location.search).get('code')

  useEffect(() => {
    if (code) {
      props.home.night(code)
      setSeverity({severity: "success", message: "Created Playlist."});
    } else {
      // window.close()
      setTimeout(function () { window.close(); }, 1000);
    }
  }, []);

  return (
    <div >
      <Alert className={classes.root} severity={severity.severity}>{severity.message}</Alert>
    </div>
  );
}));

export default Dashboard;