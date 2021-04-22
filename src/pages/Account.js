import React from 'react';
import {
    useEffect
} from 'react';
import {
    Redirect
} from 'react-router-dom';
import {
    change_myself,
    get_user_data,
    isAuthenticated
} from '../API/auth';

function Account() {
    const [user, setUser] = React.useState();
    useEffect(() => {
        async function fetchData() {
            const user = await get_user_data();
            setUser(user);
        }
        fetchData();
    }, [])

    const uploadImage = async (evt) => {
        var reader = new FileReader();
        var file = evt.target.files[0];

        reader.onload = async function (upload) {
            await change_myself(user.username,user.email,user.full_name,upload.target.result,user.permissions)
        };
        reader.readAsDataURL(file);
    }
    return !isAuthenticated() ? ( < Redirect to = "/login" / > ) : ( <>
        <input type="file" onChange={uploadImage} />
        </>
        
    )
}
export default Account;