import { Button, Grid, makeStyles, Paper, TextField } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { Redirect, useHistory } from "react-router-dom";
import { isAuthenticated, login } from "../API/auth";
import React from 'react';

const useStyles = makeStyles((theme) => ({
    margin: {
      margin: theme.spacing(2),
    },
    padding: {
      padding: theme.spacing(1),
    },
    button: {
      textTransform: 'none',
    },
    marginTop: {
      marginTop: 10,
    },
  }));


export default function Signup() {
    const classes = useStyles();
    const history = useHistory();
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');
    
    const handleSubmit = async () => {
        setError('')
        try {
            const data = await login(username,password);
            if (data) {
                history.push('/');
            }
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError(err);
            }
        }
    }
    return isAuthenticated() ? (<Redirect to="/" />) : (
        <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justify="center"
            style={{ minHeight: '100vh' }}
        >
            <Paper className={classes.padding}>
                <div className={classes.margin}>
                    <Grid container alignItems="center">
                        {error && (
                            <Grid item>
                            <Alert severity="error">{error}</Alert>
                            </Grid>
                        )}
                    </Grid>
                    <TextField required label="Username" fullWidth autoFocus className={classes.marginTop} onChange={(e) => {
                        setUsername(e.currentTarget.value);
                    }} onKeyPress={async (ev) => {
                        if (ev.key === 'Enter') {
                          ev.preventDefault();
                          await handleSubmit();
                        }
                      }}/>
                    <TextField required label="Password" type="password" autoComplete="current-password" fullWidth className={classes.marginTop} onChange={(e) => {
                        setPassword(e.currentTarget.value);
                    }} onKeyPress={async (ev) => {
                        if (ev.key === 'Enter') {
                          ev.preventDefault();
                          await handleSubmit();
                        }
                      }}/>
                    <Grid container justify="center" className={classes.marginTop}>
                        {' '}
                        <Button
                            variant="outlined"
                            color="primary"
                            className={classes.button}
                            onClick={() => history.push('/signup')}
                        >
                            Sign Up
                        </Button>{' '}
                        &nbsp;
                        <Button
                            variant="outlined"
                            color="primary"
                            className={classes.button}
                            onClick={handleSubmit}
                        >
                            Login
                        </Button>
                    </Grid>
                </div>
            </Paper>
        </Grid>
    )
}