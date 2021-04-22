import { Card, CardContent, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { get_user_data, isAuthenticated } from '../API/auth';

const useStyle = makeStyles({
    card: {
        marginLeft: "25%",
        width: "50%",
        marginTop: "3em",
        padding: "1.5em"
    },
    content: {
        display: "flex",
    },
    marginleft: {
        marginLeft: "2em",
        textAlign: "center"
    }
})

export default function Profile() {
    const classes = useStyle();
    const [user, setUser] = React.useState();
    useEffect(() => {
        async function fetchData() {
            const user = await get_user_data();
            setUser(user);
        }
        fetchData();
    }, [])

    return !isAuthenticated ? ( < Redirect to = "/login" / > ) : (<>
        {user && (
            <Card className={classes.card}>
                <CardContent className={classes.content}>
                    <img src={user.image} alt="" />
                    <div className={classes.marginleft}>
                        <Typography variant="h3">{user.username}</Typography>
                        <Typography variant="h6">{user.email}</Typography>
                    </div>
                </CardContent>
            </Card>
        )}
        </>
    )
}