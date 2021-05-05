import { Card, CardActionArea, CardContent, Grid, makeStyles, Typography } from "@material-ui/core";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { createEditor } from "slate";
import { Editable, Slate, withReact } from "slate-react";

const useStyles = makeStyles((theme) => ({
    tile: {
        maxHeight: "20vh",
        overflow: "hidden",
        textOverflow: "ellipses",
        // width: "100%",
    },
    GridListTile: {
        // width: '100%'
    }
}));

export default function Note(props) {
    const classes = useStyles();
    const note = props.note;
    const isParent = props.parent;
    var link = isParent ? "/catagory/"+note.id : "/note/"+note.id;
    const editor = useMemo(() => withReact(createEditor()), [])
    return (
    <Grid item className={classes.GridListTile}>
        <Link to={link} style={{textDecoration: "none"}}>
            <Card  className={classes.tile}>
                <CardActionArea>
                    <CardContent>
                        <Typography gutterBottom variant="h5">{note.name}</Typography>
                        <Typography variant="body2" color="textSecondary" component="div"><Slate editor={editor} value={JSON.parse(note.content)}><Editable readOnly/></Slate></Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        </Link>
    </Grid>
    )
}