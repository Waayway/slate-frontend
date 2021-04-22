import { Address, get_user_data } from './auth';

export const get_my_notes = async () => {
    const user = await get_user_data();
    return user.notes
}

export const get_note_from_id = async (id) => {
    const request = new Request(Address+"/notes/id/"+id.toString())
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

export const create_note = async (name, type, content) => {
    if (!(name.length > 0) || !(type.length > 0)) {
        throw new Error("Name, type or content wasn't was not provided");
    }
    const permission = "";
    const today = new Date();
    const createdate = today.getFullYear()+"-"+(today.getMonth()+1).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false})+"-"+today.getDate();
    const updatedate = createdate;
    const header = new Headers();
    header.append("Authorization", "Bearer "+localStorage.getItem("token"))
    const request = new Request(Address+"/notes", {
        method: "POST",
        headers: header,
        body: JSON.stringify({
            name: name,
            type: type,
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
export const change_note = async (id, name, content) => {
    if (!(name.length > 0) || !(content.length > 0)) {
        throw new Error("Name or Content wasn't provided.")
    }
    const today = new Date();
    const updatedate = today.getFullYear()+"-"+(today.getMonth()+1).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false})+"-"+today.getDate();
    const header = new Headers();
    header.append("Authorization", "Bearer "+localStorage.getItem("token"))
    const request = new Request(Address+"/notes/change/"+id.toString(), {
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

export const delete_note = async (id) => {
    const header = new Headers();
    header.append("Authorization", "Bearer "+localStorage.getItem("token"))
    const request = new Request(Address+"/notes/"+id.toString(), {
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