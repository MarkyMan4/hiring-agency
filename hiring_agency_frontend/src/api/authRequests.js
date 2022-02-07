import axios from 'axios';

const baseUrl = 'http://127.0.0.1:8000/';

export const login = async (username, password) => {
    let url = baseUrl + 'api/auth/login';
    let body = {
        username: username,
        password: password
    };

    return axios.post(url, body)
        .then(res => res.data)
        .catch(err => console.log(err));
}

export const getUser = async (token) => {
    let url = baseUrl + 'api/auth/user';
    let config = {
        headers: {
            'Authorization': 'Token ' + token
        }
    };

    return axios.get(url, config)
        .then(res => res.data)
        .catch(err => console.log(err));
}

export const logout = async (token) => {
    let url = baseUrl + 'api/auth/logout';
    let config = {
        headers: {
            'Authorization': 'Token ' + token
        }
    };

    return axios.post(url, {}, config)
        .then(res => res.data)
        .catch(err => console.log(err));
}

export const changePassword = async (token, oldPassword, newPassword) => {
    let url = baseUrl + 'api/auth/change_password';

    let body = {
        old_pass: oldPassword,
        new_pass: newPassword
    };

    let config = {
        headers: {
            'Authorization': 'Token ' + token
        }
    };

    return axios.post(url, body, config)
        .then(res => res.data)
        .catch(err => console.log(err));
}
