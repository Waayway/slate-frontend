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