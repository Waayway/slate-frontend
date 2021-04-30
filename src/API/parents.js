import { Address, get_user_data } from './auth';

export const get_my_parents = async () => {
    const user = await get_user_data();
    return user.parents
}

export const create_parent = async (name, content) => {
    if (!(name.length > 0)) {
        throw new Error("Name or content wasn't was not provided");
    }
    const permission = "";
    const today = new Date();
    const createdate = today.getFullYear()+"-"+(today.getMonth()+1).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false})+"-"+today.getDate();
    const updatedate = createdate;
    const header = new Headers();
    header.append("Authorization", "Bearer "+localStorage.getItem("token"))
    const request = new Request(Address+"/parents", {
        method: "POST",
        headers: header,
        body: JSON.stringify({
            name: name,
            content: content,
            permission: permission,
            createdate: createdate,
            updatedate: updatedate
        })
    });
    const response = await fetch(request);
    const data = await response.json();
    if (response.status > 400 && response.status < 500) {
        if (data.detail) {
            throw data.detail;
        }
        throw data;
    }
    return data;
}

export const link_parent_note = async (parentid, noteid) => {
    const header = new Headers();
    header.append("Authorization", "Bearer "+localStorage.getItem("token"))
    const request = new Request(Address+'/parents/link', {
        method: "POST",
        headers: header,
        body: JSON.stringify({
            parentid: parentid,
            noteid: noteid
        })
    });
    const response = await fetch(request);
    const data = await response.text();
    if (response.status > 400 && response.status < 500) {
        if (data.detail) {
            throw data.detail;
        }
        throw data;
    }
    return data;
}


export const get_parent_from_id = async (id) => {
    const header = new Headers();
    header.append("Authorization", "Bearer "+localStorage.getItem("token"))
    const request = new Request(Address+"/parent/id/"+id.toString(), {headers: header})
    const response = await fetch(request)
    const data = response.json()
    if (response.status > 400 && response.status < 500) {
        if (data.detail) {
            throw data.detail;
        }
        throw data;
    }
    return data;
}

export const change_parent = async (id, name, content) => {
    if (!(name.length > 0) || !(content.length > 0)) {
        throw new Error("Name or Content wasn't provided.")
    }
    const today = new Date();
    const updatedate = today.getFullYear()+"-"+(today.getMonth()+1).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false})+"-"+today.getDate();
    const header = new Headers();
    header.append("Authorization", "Bearer "+localStorage.getItem("token"))
    const request = new Request(Address+"/parent/change/"+id.toString(), {
        method: 'POST',
        headers: header,
        body: JSON.stringify({
            name: name,
            content: content,
            updatedate: updatedate
        })
    });
    const response = await fetch(request);
    const data = await response.json()
    if (response.status > 400 && response.status < 500) {
        if (data.detail) {
            throw data.detail;
        }
        throw data;
    }
    return data;
}


export const delete_parent = async (id) => {
    const header = new Headers();
    header.append("Authorization", "Bearer "+localStorage.getItem("token"))
    const request = new Request(Address+"/parent/"+id.toString(), {
        method: "DELETE",
        headers: header
    });
    const response = await fetch(request);
    const data = await response.text();
    if (response.status > 400 && response.status < 500) {
        if (data.detail) {
            throw data.detail;
        }
        throw data;
    }
    return data;
}

export const get_parents_by_permission = async () => {
    const header = new Headers();
    header.append("Authorization", "Bearer "+localStorage.getItem("token"))
    const request = new Request(Address+"/parent/permission", {headers: header})
    const response = await fetch(request)
    const data = await response.json()
    return data;
}