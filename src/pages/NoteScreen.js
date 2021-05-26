import { Box, makeStyles } from "@material-ui/core";
import React from "react";
import { Redirect } from "react-router-dom";
import { isAuthenticated } from "../API/auth";

const useStyle = makeStyles((theme) => ({
    test: {
        // background: "red",
        width: "100%",
        height: "calc(100vh - 56px)",
        [`${theme.breakpoints.up("xs")} and (orientation: landscape)`]: {
            height: "calc(100vh - 48px)",
        },
        [theme.breakpoints.up("sm")]: {
            height: "calc(100vh - 64px)",
        },
    },
}));

export default function NoteScreen() {
    const classes = useStyle();

    return !isAuthenticated ? (
        <Redirect to="/login" />
    ) : (
        <>
            <Box className={classes.test}>hello</Box>
        </>
    );
}
