import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, makeStyles, TextField } from '@material-ui/core';
import React from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import { isAuthenticated } from '../API/auth';
import AddIcon from '@material-ui/icons/Add';
import { create_note, get_my_notes } from '../API/notes';
import { useEffect } from 'react';
import Note from '../components/Note';

const useStyles = makeStyles({
    main: {
        margin: 8,
    },
    buttonRow: {
        display: "flex",
        justifyContent: "flex-end",
        marginBottom: ".5em",
        maxWidth: "90%",
        marginLeft: "10%",
    },
    links: {
        textDecoration: "none",
    }
})

export default function Notes() {
    const classes = useStyles();
    const history = useHistory();
    const [notes, setNotes] = React.useState([]);
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [inputNameDialog, setInputNameDialog] = React.useState("");
    
    useEffect(() => {
        async function fetchData() {
            const notes = await get_my_notes();
            setNotes(notes);
        }
        fetchData();        
    }, [])
    
    const openDialog = () => {
        setDialogOpen(true);
    }

    const closeDialog = () => {
        setDialogOpen(false);
    }

    const create_a_note = async () => {
        const note = await create_note(inputNameDialog, "text", JSON.stringify([{children: [{text:""}]}]));
        history.push("/edit/note/"+note.id)
    }

    return !isAuthenticated() ? (<Redirect to="/login" />) :  (
        <main className={classes.main}>
            <div className={classes.buttonRow}>
                <Button color="secondary" onClick={openDialog} variant="contained" aria-label="Create A Note" startIcon={<AddIcon />}>Create A Note</Button>
            </div>
            <Grid container spacing={2}>
                {notes.map((note, index) => 
                    <Note note={note} key={index} />
                )}
            </Grid>
            <Dialog open={dialogOpen} onClose={closeDialog}>
                <DialogTitle>Create new note</DialogTitle>
                <DialogContent>
                    <TextField 
                    autoFocus
                    margin="none"
                    id="name"
                    label="Name of the note"
                    fullWidth
                    onChange={(e) => {setInputNameDialog(e.currentTarget.value)}}
                    onKeyPress={async (ev) => {
                        if (ev.key === 'Enter') {
                          ev.preventDefault();
                          await create_a_note();
                        }
                      }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={create_a_note} color="primary">
                        Create Note
                    </Button>
                </DialogActions>
            </Dialog>
        </main>
    )
}