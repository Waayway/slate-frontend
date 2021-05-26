import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    Grid,
    GridList,
    makeStyles,
    TextField,
    Typography,
} from "@material-ui/core";
import React from "react";
import { Redirect, useHistory } from "react-router-dom";
import { isAuthenticated } from "../API/auth";
import AddIcon from "@material-ui/icons/Add";
import ShareIcon from "@material-ui/icons/Share";
import { useEffect } from "react";
import Note from "../components/Note";
import {
    create_parent,
    get_my_parents,
    get_parents_by_permission,
} from "../API/parents";
import { get_permission_for_parent } from "../API/notes";
import { Alert } from "@material-ui/lab";

const useStyles = makeStyles({
    main: {
        margin: 8,
    },
    buttonRow: {
        display: "flex",
        justifyContent: "flex-end",
        marginBottom: ".5em",
        width: "100%",
    },
    links: {
        textDecoration: "none",
    },
    text: {
        marginTop: "1em",
        marginBottom: "1em",
    },
    button: {
        marginLeft: 5,
        marginBottom: 5,
    },
});

export default function Notes() {
    const classes = useStyles();
    const history = useHistory();
    const [parents, setParents] = React.useState([]);
    const [permissionParents, setPermissionParents] = React.useState([]);
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [permissionDialogOpen, setPermissionDialogOpen] =
        React.useState(false);
    const [inputNameDialog, setInputNameDialog] = React.useState("");
    const [permissionInput, setPermissionInput] = React.useState("");
    const [permissionError, setPermissionError] = React.useState();

    useEffect(() => {
        async function fetchData() {
            const parents = await get_my_parents();
            setParents(parents);
            const permissionparents = await get_parents_by_permission();
            if (permissionparents.data != null) {
                setPermissionParents(permissionparents.data);
            } else {
                setPermissionParents(null);
            }
        }
        fetchData();
    }, []);

    const openDialog = () => {
        setDialogOpen(true);
    };

    const closeDialog = () => {
        setDialogOpen(false);
    };

    const create_a_parent = async () => {
        const parent = await create_parent(
            inputNameDialog,
            JSON.stringify([{ children: [{ text: "" }] }])
        );
        history.push("/edit/catagory/" + parent.id);
    };

    const get_permission = async () => {
        try {
            await get_permission_for_parent(permissionInput);
            history.go(0);
        } catch (err) {
            if (err instanceof Error) {
                setPermissionError(err.message);
            } else {
                setPermissionError(err);
            }
        }
    };

    return !isAuthenticated() ? (
        <Redirect to="/login" />
    ) : (
        <main className={classes.main}>
            <div className={classes.buttonRow}>
                <Grid>
                    <Button
                        color="secondary"
                        onClick={() => {
                            setPermissionDialogOpen(true);
                        }}
                        className={classes.button}
                        variant="contained"
                        aria-label="Get Permission for category"
                        startIcon={<ShareIcon />}
                    >
                        Get Permission for category
                    </Button>
                    <Button
                        color="secondary"
                        onClick={openDialog}
                        className={classes.button}
                        variant="contained"
                        aria-label="Create A Note"
                        startIcon={<AddIcon />}
                    >
                        Create A Catagory
                    </Button>
                </Grid>
            </div>
            <GridList cols={3} cellHeight="auto" spacing={0}>
                {parents.map((parent, index) => (
                    <Note note={parent} key={index} parent={true} />
                ))}
            </GridList>
            {permissionParents && (
                <>
                    <Typography variant="h4" className={classes.text}>
                        Categories you have permission for.
                    </Typography>
                    <GridList cols={3} cellHeight="auto" spacing={10}>
                        {permissionParents.map((parent, index) => (
                            <Note note={parent} key={index} parent={true} />
                        ))}
                    </GridList>
                </>
            )}
            <Dialog open={dialogOpen} onClose={closeDialog}>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="none"
                        id="name"
                        label="Name of the catagory"
                        fullWidth
                        onChange={(e) => {
                            setInputNameDialog(e.currentTarget.value);
                        }}
                        onKeyPress={async (ev) => {
                            if (ev.key === "Enter") {
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
            <Dialog
                open={permissionDialogOpen}
                onClose={() => {
                    setPermissionDialogOpen(false);
                }}
            >
                <DialogContent>
                    <Grid container alignItems="center">
                        {permissionError && (
                            <Grid item>
                                <Alert severity="error">
                                    {permissionError}
                                </Alert>
                            </Grid>
                        )}
                    </Grid>
                    <TextField
                        autoFocus
                        margin="none"
                        label="Key for permission"
                        fullWidth
                        onChange={(e) => {
                            setPermissionInput(e.currentTarget.value);
                        }}
                        onKeyPress={async (ev) => {
                            if (ev.key === "Enter") {
                                ev.preventDefault();
                                await get_permission();
                            }
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            setPermissionDialogOpen(false);
                        }}
                        color="primary"
                    >
                        Cancel
                    </Button>
                    <Button onClick={get_permission} color="primary">
                        Get Permission
                    </Button>
                </DialogActions>
            </Dialog>
        </main>
    );
}
