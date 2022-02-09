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
        .catch(err => console.log('Failed to authentiate user'));
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
        .catch(err => console.log('Failed to retrieve user'));
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
        .catch(err => console.log('Failed to logout'));
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
        .catch(err => console.log('Failed to change password'));
}

export const setSecurityQuestion = async (token, questionId, answer) => {
    let url = baseUrl + 'api/securityquestionanswers';

    let body = {
        question: questionId,
        answer: answer
    };

    let config = {
        headers: {
            'Authorization': 'Token ' + token
        }
    };

    return axios.post(url, body, config)
        .then(res => res.data)
        .catch(err => console.log('Failed to set security question'));
}

export const getSecurityQuestionsForUser = async (token) => {
    let url = baseUrl + 'api/securityquestionanswers';
    
    let config = {
        headers: {
            'Authorization': 'Token ' + token
        }
    };

    return axios.get(url, config)
        .then(res => res.data)
        .catch(err => console.log('Failed to retrieve security questions'));
}


export const addNewStaff = async(token) =>{
    let url = baseUrl + 'api/auth/register_staff';
    let body = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: phone,
        address: address,
    }

    return axios.post(url, config)
        .then(res => res.data)
        .catch(err => console.log('Failed to add new staff'));

}

export const lockAccount = async (token) => {
    let url = baseUrl + 'api/auth/lock_user';

    let config = {
        headers: {
            'Authorization': 'Token ' + token
        }
    };

    return axios.post(url, {}, config)
        .then(res => res.data)
        .catch(err => console.log('Failed to lock user account'));

}
