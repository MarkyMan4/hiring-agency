import axios from 'axios';

/*
POST http://127.0.0.1:8000/api/auth/login
body: 
{
    "username": "Person1",
    "password": "abc123$"
}
*/

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