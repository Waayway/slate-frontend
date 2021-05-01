import { Box, Button, Dialog, DialogActions, DialogContent, IconButton, makeStyles, Paper, TextField, Typography } from "@material-ui/core";
import { FormatBold as FormatBoldIcon, FormatItalic as FormatItalicIcon, FormatUnderlined as FormatUnderlinedIcon, Code as CodeIcon, LooksOne as LooksOneIcon, LooksTwo as LooksTwoIcon, FormatQuote as FormatQuoteIcon, FormatListNumbered as FormatListNumberedIcon, FormatListBulleted as FormatListBulletedIcon, Save as SaveIcon, Edit as EditIcon, ArrowBack as ArrowBackIcon} from '@material-ui/icons';
import { useEffect } from "react";
import RemoveIcon from '@material-ui/icons/Remove'
import { get_note_from_id, change_note, delete_note } from "../API/notes";
import React from "react";
import { Editable, Slate, useSlate, withReact } from "slate-react";
import { createEditor, Editor, Element as SlateElement, Transforms } from "slate";
import { useMemo } from "react";
import { useCallback } from "react";
import isHotkey from 'is-hotkey';
import theme from '../theme';
import {Element, Leaf} from '../slateConfig';
import { Redirect, useHistory } from "react-router";
import { Link as LinkRouter } from "react-router-dom";
import { useRef } from "react";
import { isAuthenticated } from "../API/auth";

const useStyles = makeStyles({
    main: {
        margin: 8,
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
    toolbar: {
      display: "flex",
      backgroundColor: theme.palette.primary.main,
    },
    nonActive: {
      color: "rgba(255,255,255,0.5)",
    },
    activeButton: {
      color: "#fff",
    },
    sameLine: {
      display: "flex",
    }
});

const HOTKEYS = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code',
}

const LIST_TYPES = ['numbered-list', 'bulleted-list']

export default function NoteView(props) {
  const classes = useStyles();
  const history = useHistory();
  const noteid = props.match.params.note;
  const [note, setNote] = React.useState();
  const editor = useMemo(() => withReact(createEditor()), [])
  const [noteContent, setNoteContent] = React.useState([{children: [{text: ""}]}]);
  const [changeTitleOpen, setChangeTitleOpen] = React.useState(false);
  const [changeTitle, setChangeTitle] = React.useState("");
  const [DeleteNoteOpen, setDeleteNoteOpen] = React.useState(false);

  const renderElement = useCallback(props => <Element {...props} />, [])
  const renderLeaf = useCallback(props => <Leaf {...props} />, [])
  
  var baseNote = useRef();

  useEffect(() => {
    async function fetchData() {
      const note = await get_note_from_id(noteid);
      setNote(note.data);
      setNoteContent(JSON.parse(note.data.content))
      setChangeTitle(note.data.name)
      baseNote.current = note.data;
    }
    fetchData();
  }, [noteid]);

  const saveNote = async () => {
    if (noteContent !== JSON.parse(baseNote.current.content)) {
      await change_note(note.id, note.name, JSON.stringify(noteContent))
      baseNote.current = note;
    } 
  }
  const deleteNote = async () => {
    await delete_note(note.id);
    history.push("/notes")
  }
  const change_title = async () => {
    await change_note(note.id, changeTitle, JSON.stringify(noteContent))
    setChangeTitleOpen(false);
  }

  return !isAuthenticated() ? ( < Redirect to = "/login" / > ) : (
    <main className={classes.main}>
    <div className={classes.sameLine} >
    {note && (<IconButton component={LinkRouter} to={"/note/"+note.id}><ArrowBackIcon /></IconButton>)}
    <div className={classes.buttonRow}>
        <Button className={classes.button} color="secondary" variant="contained" aria-label="Delete This note" startIcon={<EditIcon />} onClick={() => setChangeTitleOpen(true)}>Change Title</Button>
        <Button className={classes.button} color="secondary" variant="contained" aria-label="Delete This note" startIcon={<RemoveIcon />} onClick={() => setDeleteNoteOpen(true)}>Delete This Note</Button>
    </div>
    </div>
    {note && (
      <Box padding={2}>
        <Typography variant="h2" id="title">{changeTitle}</Typography>
        <Slate editor={editor} value={noteContent} onChange={e => setNoteContent(e)}>
          <Paper color="primary" className={classes.toolbar} elevation={0}>
            <MarkButton format="bold" icon={<FormatBoldIcon />} nonActiveClass={classes.nonActive} activeClass={classes.activeButton}/>
            <MarkButton format="italic" icon={<FormatItalicIcon />} nonActiveClass={classes.nonActive} activeClass={classes.activeButton}/>
            <MarkButton format="underline" icon={<FormatUnderlinedIcon />} nonActiveClass={classes.nonActive} activeClass={classes.activeButton}/>
            <MarkButton format="code" icon={<CodeIcon />} nonActiveClass={classes.nonActive} activeClass={classes.activeButton}/>

            <BlockButton format="heading-one" icon={<LooksOneIcon />} nonActiveClass={classes.nonActive} activeClass={classes.activeButton}/>
            <BlockButton format="heading-two" icon={<LooksTwoIcon />} nonActiveClass={classes.nonActive} activeClass={classes.activeButton}/>
            <BlockButton format="block-quote" icon={<FormatQuoteIcon />} nonActiveClass={classes.nonActive} activeClass={classes.activeButton}/>
            <BlockButton format="numbered-list" icon={<FormatListNumberedIcon />} nonActiveClass={classes.nonActive} activeClass={classes.activeButton}/>
            <BlockButton format="bulleted-list" icon={<FormatListBulletedIcon />} nonActiveClass={classes.nonActive} activeClass={classes.activeButton}/>

            <IconButton onClick={saveNote}>
              <SaveIcon />
            </IconButton>
          </Paper>
          <Editable 
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder="Enter text here!"
          spellCheck autoFocus
          onKeyDown={event => {
            for (const hotkey in HOTKEYS) {
              if(isHotkey(hotkey, event)) {
                event.preventDefault()
                const mark = HOTKEYS[hotkey]
                toggleMark(editor,mark)
              }
            }
            if(isHotkey("mod+s", event)) {
              event.preventDefault();
              saveNote();
            }
          }}
          />
        </Slate>
      </Box>
    )}
    <Dialog open={changeTitleOpen} onClose={() => setChangeTitleOpen(false)}>
      <DialogContent>
        {(note &&
        <TextField 
        autoFocus
        label="Change Title"
        id="changeTitle"
        fullWidth
        onChange={(e) => setChangeTitle(e.currentTarget.value)}
        value={changeTitle}
        onKeyPress={async (ev) => {
          if (ev.key === 'Enter') {
            ev.preventDefault();
            await change_title();
          }
        }}
        />)}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setChangeTitleOpen(false)} color="primary">
          Cancel
        </Button>
        <Button onClick={change_title} color="primary">
          Change Title
        </Button>
      </DialogActions>
    </Dialog>
    <Dialog open={DeleteNoteOpen} onClose={() => setDeleteNoteOpen(false)}>
      <DialogContent>
        <Typography>You can't get this back are you sure you want to delete this note</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setDeleteNoteOpen(false)} color="primary">
          Cancel
        </Button>
        <Button onClick={deleteNote} color="secondary">
          Delete Note
        </Button>
      </DialogActions>
    </Dialog>
    </main>
  );
}

const MarkButton = ({format,icon,nonActiveClass, activeClass}) => {
  const editor = useSlate()
  const active = isMarkActive(editor, format);
  return !active ? (
    <IconButton className={nonActiveClass}
    onMouseDown={event => {
      event.preventDefault()
      toggleMark(editor, format)
    }}
    >
      {icon}
    </IconButton>
  ) : (
    <IconButton className={activeClass}
    onMouseDown={event => {
      event.preventDefault()
      toggleMark(editor, format)
    }}
    >
      {icon}
    </IconButton>
  )
}
const BlockButton = ({format,icon,nonActiveClass, activeClass}) => {
  const editor = useSlate()
  const active = isBlockActive(editor, format);
  return !active ? (
    <IconButton className={nonActiveClass}
    onMouseDown={event => {
      event.preventDefault()
      toggleBlock(editor, format)
    }}
    >
      {icon}
    </IconButton>
  ) : (
    <IconButton className={activeClass}
    onMouseDown={event => {
      event.preventDefault()
      toggleBlock(editor, format)
    }}
    >
      {icon}
    </IconButton>
  )
}

const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor)
  return marks ? marks[format] === true : false
}

const isBlockActive = (editor, format) => {
  const [match] = Editor.nodes(editor, {
    match: n =>
      !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
  })

  return !!match
}

const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(editor, format)
  const isList = LIST_TYPES.includes(format)

  Transforms.unwrapNodes(editor, {
    match: n =>
      LIST_TYPES.includes(
        !Editor.isEditor(n) && SlateElement.isElement(n) && n.type
      ),
    split: true,
  })
  const newProperties = {
    type: isActive ? 'paragraph' : isList ? 'list-item' : format,
  }
  Transforms.setNodes(editor, newProperties)

  if (!isActive && isList) {
    const block = { type: format, children: [] }
    Transforms.wrapNodes(editor, block)
  }
}

const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format)

  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}