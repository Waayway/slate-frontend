import {
    Box,
    Button,
    IconButton,
    makeStyles,
    Typography,
} from "@material-ui/core";
import { useEffect } from "react";
import EditIcon from "@material-ui/icons/Edit";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { get_note_from_id } from "../API/notes";
import React from "react";
import { useMemo } from "react";
import { Editable, Slate, withReact } from "slate-react";
import { createEditor } from "slate";
import { Element, Leaf } from "../slateConfig";
import { Redirect, useHistory } from "react-router";
import { Link as LinkRouter } from "react-router-dom";
import { isAuthenticated } from "../API/auth";

const useStyles = makeStyles({
    main: {
        margin: 8,
    },
    editNote: {
        position: "absolute",
        marginTop: "1em",
        right: "1em",
    },
    sameLine: {
        display: "flex",
    },
});

export default function NoteView(props) {
    const classes = useStyles();
    const history = useHistory();
    const noteid = props.match.params.note;
    const editor = useMemo(() => withReact(createEditor()), []);
    const [note, setNote] = React.useState();
    const [editable, setEditable] = React.useState(false);

    useEffect(() => {
        async function fetchData() {
            const note = await get_note_from_id(noteid);
            if (note.data.type !== "text") {
                history.push("/notes");
            }
            setNote(note.data);
            setEditable(note.edit);
        }
        fetchData();
    }, [noteid, history]);

    return !isAuthenticated() ? (
        <Redirect to="/login" />
    ) : (
        <>
            <div className={classes.sameLine}>
                <IconButton
                    onClick={() => {
                        history.push("/notes");
                    }}
                >
                    <ArrowBackIcon />
                </IconButton>
                {editable && (
                    <Button
                        color="secondary"
                        component={LinkRouter}
                        to={"/edit/note/" + noteid}
                        variant="contained"
                        aria-label="Edit This Note"
                        startIcon={<EditIcon />}
                        className={classes.editNote}
                    >
                        Edit This Note
                    </Button>
                )}
            </div>
            {note && (
                <Box padding={2}>
                    <Typography variant="h2">{note.name}</Typography>
                    <Slate editor={editor} value={JSON.parse(note.content)}>
                        <Editable
                            readOnly
                            renderElement={Element}
                            renderLeaf={Leaf}
                        />
                    </Slate>
                </Box>
            )}
        </>
    );
}
