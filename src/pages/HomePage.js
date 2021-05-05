import { Card, Grid, makeStyles, Typography } from '@material-ui/core';
import React, { useEffect } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import { isAuthenticated } from '../API/auth';
import { get_my_notes } from '../API/notes';
import Note from '../components/Note';

const useStyles = makeStyles({
    main: {
        margin: 8,
    },
    paper: {
        margin: "8px 0",
        padding: "1em",
        display: "inline-block",
    },
})

export default function HomePage() {
    const classes = useStyles();
    const history = useHistory();

    const [notes, setNotes] = React.useState([]);

    useEffect(() => {
        async function fetchData() {
            const notes = await get_my_notes();
            if (notes) {
                setNotes(notes);
            } else {
                history.push('/logout')
            }
        }
        fetchData();        
    }, [history])

    return !isAuthenticated() ? (<Redirect to="/login" />) : (
        <main className={classes.main}>
            <Card className={classes.paper}>
                <Typography variant="h4">Recent Notes</Typography>
            </Card>
            <Grid container spacing={2}>
                {notes.map((note, index) => 
                    <Note note={note} key={index} />
                )}
            </Grid>
        </main>
    )
}