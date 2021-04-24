import { Box, Button, Checkbox, Dialog, DialogContent, DialogTitle, FormControlLabel, FormGroup, GridList, IconButton, makeStyles, Typography } from "@material-ui/core";
import { useEffect } from "react";
import EditIcon from '@material-ui/icons/Edit';
import LinkIcon from '@material-ui/icons/Link';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { get_parent_from_id, link_parent_note } from "../API/parents";
import React from "react";
import { useMemo } from "react";
import { Editable, Slate, withReact } from "slate-react";
import { createEditor } from "slate";
import { Element, Leaf} from '../slateConfig'
import { useHistory } from "react-router";
import { Link as LinkRouter } from "react-router-dom";
import { get_my_notes } from "../API/notes";
import Note from "../components/Note";

const useStyles = makeStyles({
  main: {
    margin: 8,
  },
  sameLine: {
    display: "flex",
  },
  buttonRow: {
    position: "absolute",
    display: "flex",
    // flexDirection: "column",
    justifyContent: "flex-end",
    marginBottom: ".5em",
    right: 10,
},
button: {
    marginLeft: 5,
  },
});

export default function CatagoryView(props) {
  const classes = useStyles();
  const history = useHistory();
  const parentid = props.match.params.parent;
  const editor = useMemo(() => withReact(createEditor()), []);
  const [parent, setParent] = React.useState();
  const [linkDialogOpen, setLinkDialogOpen] = React.useState(false);
  const [notes, setNotes] = React.useState([]);
  

  useEffect(() => {
    async function fetchData() {
      const parent = await get_parent_from_id(parentid);
      setParent(parent.data);
      const notes = await get_my_notes();
      notes.forEach(note => {
        if (note.parent_id === parent.data.id) {
          note.linked = true;
        } else {
          note.linked = false;
        }
      });
      setNotes(notes)
      console.log(notes, parent)
    }
    fetchData();
  }, [parentid]);
  
  const checkBoxChange = async (ev) => {
    const id = ev.target.id;
    const result = await link_parent_note(parentid, id)
    console.log(result)
  }

  return (
    <main className={classes.main}>
    <div className={classes.sameLine}>
    <IconButton onClick={() => {history.push('/categories')}}><ArrowBackIcon /></IconButton>
    <div className={classes.buttonRow} >
    <Button color="secondary" className={classes.button} onClick={() => {setLinkDialogOpen(true)}} variant="contained" aria-label="Link Notes" startIcon={<LinkIcon />}>Link Notes</Button>
    <Button color="secondary" className={classes.button} component={LinkRouter} to={"/edit/catagory/"+parentid} variant="contained" aria-label="Edit This Catagory" startIcon={<EditIcon />}>Edit This Catagory</Button>
    </div>
    </div>
    {parent && (
      <Box padding={2}>
        <Typography variant="h2">{parent.name}</Typography>
        <Slate editor={editor} value={JSON.parse(parent.content)}><Editable readOnly renderElement={Element} renderLeaf={Leaf} /></Slate>
        <GridList cols={3} cellHeight="auto" spacing={1}>
                {parent.childs.map((note, index) => 
                    <Note note={note} key={index}/>
                )}
            </GridList>
      </Box>
    )}
    <Dialog open={linkDialogOpen} onClose={() => setLinkDialogOpen(false)}>
      <DialogTitle>Select Notes to link</DialogTitle>
      <DialogContent dividers>
        <FormGroup>
        {notes.map((note, index) =>
          <FormControlLabel key={index} control={<CheckBoxLink note={note} onChange={checkBoxChange} id={index.toString()}/>} label={note.name} />
        )}
        </FormGroup>
      </DialogContent>
    </Dialog>
    </main>
  );
}

const CheckBoxLink = ({note, onChange, id}) => {
  const [checked, setChecked] = React.useState(note.linked);
  return (
    <Checkbox onChange={(ev) => {setChecked(!checked);onChange(ev)}} checked={checked} id={id}/>
  )
}