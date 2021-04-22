// import decodeJWT from 'jwt-decode';

export const Address = `http://${document.location.hostname}:8080`

export const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    if (token == null) {
        return false;
    }
    return true;
}

export const login = async (username, password) => {
    if (!(username.length > 0) || !(password.length > 0)) {
        throw new Error('Email or password was not provided');
    }
    const formData = new FormData();
    formData.append('username', username)
    formData.append('password', password)
    const request = new Request(Address + '/login', {
        method: "POST",
        body: formData,
    });
    const response = await fetch(request);
    if (response.status === 500) {
        throw new Error('Internal server error');
    }
    const data = await response.json();
    if (response.status > 400 && response.status < 500) {
        if (data.detail) {
            throw data.detail;
        }
        throw data;
    }

    if ('access_token' in data) {
        localStorage.setItem('token', data['access_token']);
    }
    return data;
}

export const signUp = async (username, full_name, email, password) => {
    if (!(username.length > 0)) {
        throw new Error('Username was not provided');
    }
    if (!(full_name.length > 0)) {
        throw new Error('Full Name was not provided');
    }
    if (!(email.length > 0)) {
        throw new Error('Email was not provided')
    }
    if (!(password.length > 0)) {
        throw new Error('Password was not provided');
    }
    const request = new Request(Address + "/users", {
        method: "POST",
        body: JSON.stringify({
            username: username,
            email: email,
            full_name: full_name,
            permissions: "[]",
            password: password,
        })
    })

    const response = await fetch(request)
    if (response.status === 500) {
        throw new Error('Internal server error');
    }
    const data = await response.json();
    if (response.status > 400 && response.status < 500) {
        if (data.detail) {
            throw data.detail;
        }
        throw data;
    }
    return data;
}

export const logout = () => {
    localStorage.removeItem('token');
}

export const get_user_data = async () => {
    const header = new Headers();
    header.append("Authorization", "Bearer " + localStorage.getItem("token"))
    const request = new Request(Address + "/users/me", {
        method: "GET",
        headers: header,
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

export const change_myself = async (username, email, full_name, image, permissions) => {
    const header = new Headers();
    header.append("Authorization", "Bearer " + localStorage.getItem("token"))
    const request = new Request(Address + "/users/change", {
        method: "POST",
        headers: header,
        body: JSON.stringify({
            username: username,
            email: email,
            full_name: full_name,
            image: image,
            permissions: permissions
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