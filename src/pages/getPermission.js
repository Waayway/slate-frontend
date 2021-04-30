import React, { useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { get_permission_for_parent } from '../API/notes';

export default function GetPermission(props) {
    const uuid = props.match.params.uuid;

    useEffect(() => {
        async function fetchData() {
            await get_permission_for_parent(uuid);
        }
        fetchData();        
    }, [uuid])
    return (<Redirect to="/categories" />)
}