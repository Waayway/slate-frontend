import React from "react";
import { Redirect } from "react-router-dom";
import { isAuthenticated, logout } from "../API/auth";

export default function Logout() {
    const Authenticated = isAuthenticated();
    if (Authenticated) {
        logout();
    }
    return <Redirect to="/login" />;
}
