import { Box, Button, Checkbox, Dialog, DialogContent, DialogTitle, FormControlLabel, FormGroup, GridList, IconButton, Link, makeStyles, Typography } from "@material-ui/core";
import { useEffect } from "react";
import EditIcon from '@material-ui/icons/Edit';
import LinkIcon from '@material-ui/icons/Link';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ShareIcon from '@material-ui/icons/Share';
import DeleteIcon from '@material-ui/icons/DeleteForever';
import { get_parent_from_id, link_parent_note } from "../API/parents";
import React from "react";
import { useMemo } from "react";
import { Editable, Slate, withReact } from "slate-react";
import { createEditor } from "slate";
import { Element, Leaf} from '../slateConfig'
import { useHistory } from "react-router";
import { Link as LinkRouter } from "react-router-dom";
import { get_my_notes, get_permission_for_parent } from "../API/notes";
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
  const [children, setChildren] = React.useState([]);
  const [editable, setEditable] = React.useState(false);
  const [permissionDialogOpen, setPermissionDialogOpen] = React.useState(false);
  

  useEffect(() => {
    async function fetchData() {
      const parent = await get_parent_from_id(parentid);
      setEditable(parent.edit);
      setParent(parent.data);
      if(parent.edit) {
        const notes = await get_my_notes();
        var childs = [];
        notes.forEach(note => {
          if (note.parent_id === parent.data.id) {
            note.linked = true;
            childs.push(note)
          } else {
            note.linked = false;
          }
        });
        setNotes(notes)
        setChildren(childs)
      } else {
        setChildren(parent.data.childs)
      }
    }
    fetchData();
  }, [parentid]);
  
  const checkBoxChange = async (ev) => {
    const id = ev.target.id;
    await link_parent_note(parentid, id)
    const notes = await get_my_notes();
    var childs = [];
      notes.forEach(note => {
        if (note.parent_id === parent.id) {
          note.linked = true;
          childs.push(note)
        } else {
          note.linked = false;
        }
      });
      setNotes(notes);
      setChildren(childs);
  }
  const removePermission = async () => {
    await get_permission_for_parent(parent.permission);
    history.push("/categories")
  }

  return (
    <main className={classes.main}>
    <div className={classes.sameLine}>
    <IconButton onClick={() => {history.push('/categories')}}><ArrowBackIcon /></IconButton>
    {editable && (
    <div className={classes.buttonRow} >
    <Button color="secondary" onClick={() => {setPermissionDialogOpen(true)}} className={classes.button} variant="contained" aria-label="Give Permission to User" startIcon={<ShareIcon />}>Give Permission to User</Button>
    <Button color="secondary" className={classes.button} onClick={() => {setLinkDialogOpen(true)}} variant="contained" aria-label="Link Notes" startIcon={<LinkIcon />}>Link Notes</Button>
    <Button color="secondary" className={classes.button} component={LinkRouter} to={"/edit/catagory/"+parentid} variant="contained" aria-label="Edit This Catagory" startIcon={<EditIcon />}>Edit This Catagory</Button>
    </div>
    )}
    {!editable && (
      <div className={classes.buttonRow} >
      <Button color="secondary" onClick={removePermission} className={classes.button} variant="contained" aria-label="Remove Permission from note" startIcon={<DeleteIcon />}>Remove Permission from note</Button>
      </div>
    )}
    </div>
    {parent && (
      <Box padding={2}>
        <Typography variant="h2">{parent.name}</Typography>
        <Slate editor={editor} value={JSON.parse(parent.content)}><Editable readOnly renderElement={Element} renderLeaf={Leaf} /></Slate>
        <GridList cols={3} cellHeight="auto" spacing={1}>
                {children.map((note, index) => 
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
          <FormControlLabel key={index} control={<CheckBoxLink note={note} onChange={checkBoxChange} id={note.id.toString()}/>} label={note.name} />
        )}
        </FormGroup>
      </DialogContent>
    </Dialog>
    <Dialog open={permissionDialogOpen} onClose={() => {setPermissionDialogOpen(false)}}>
      <DialogContent>
          <Typography>To share this Catagories and the notes beneath it, you can tell them to go to this link:</Typography>
          {parent && (<>
            <Link href={`http://${document.location.host}/note/getpermission/${parent.permission}`} color="secondary">{`${document.location.hostname}/note/getpermission/${parent.permission}`}</Link>
            <Typography>The key in this case is: " {parent.permission} " You can give either to a friend or whoever needs access to it. But be careful everyone who has this key can read ur notes</Typography>
          </>)}
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