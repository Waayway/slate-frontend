import { Button, Dialog, DialogActions, DialogContent, GridList, makeStyles, TextField } from '@material-ui/core';
import React from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import { isAuthenticated } from '../API/auth';
import AddIcon from '@material-ui/icons/Add';
import { useEffect } from 'react';
import Note from '../components/Note';
import { create_parent, get_my_parents } from '../API/parents';

const useStyles = makeStyles({
    main: {
        margin: 8,
    },
    buttonRow: {
        display: "flex",
        justifyContent: "flex-end",
        marginBottom: ".5em"
    },
    links: {
        textDecoration: "none",
    }
})

export default function Notes() {
    const classes = useStyles();
    const history = useHistory();
    const [parents, setParents] = React.useState([]);
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [inputNameDialog, setInputNameDialog] = React.useState("");
    
    useEffect(() => {
        async function fetchData() {
            const parents = await get_my_parents();
            setParents(parents);
        }
        fetchData();        
    }, [])
    
    const openDialog = () => {
        setDialogOpen(true);
    }

    const closeDialog = () => {
        setDialogOpen(false);
    }

    const create_a_parent = async () => {
        const parent = await create_parent(inputNameDialog, JSON.stringify([{children: [{text:""}]}]));
        history.push("/edit/catagory/"+parent.id)
    }

    return !isAuthenticated() ? (<Redirect to="/login" />) :  (
        <main className={classes.main}>
            <div className={classes.buttonRow}>
                <Button color="secondary" onClick={openDialog} variant="contained" aria-label="Create A Note" startIcon={<AddIcon />}>Create A Catagory</Button>
            </div>
            <GridList cols={3} cellHeight="auto" spacing={10}>
                {parents.map((parent, index) => 
                    <Note note={parent} key={index} parent={true} />
                )}
            </GridList>
            <Dialog open={dialogOpen} onClose={closeDialog}>
                <DialogContent>
                    <TextField 
                    autoFocus
                    margin="none"
                    id="name"
                    label="Name of the catagory"
                    fullWidth
                    onChange={(e) => {setInputNameDialog(e.currentTarget.value)}}
                    onKeyPress={async (ev) => {
                        if (ev.key === 'Enter') {
                          ev.preventDefault();
                          await create_a_parent();
                        }
                      }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={create_a_parent} color="primary">
                        Create Catagory
                    </Button>
                </DialogActions>
            </Dialog>
        </main>
    )
}