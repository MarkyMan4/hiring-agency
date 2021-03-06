import axios from 'axios';
import { baseUrl } from './config';

export const login = async (username, password) => {
    let url = baseUrl + 'api/auth/login';
    let body = {
        username: username,
        password: password
    };

    return axios.post(url, body)
        .then(res => res.data);
        
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

export const changePassword = async (token, oldPassword, newPassword, confirmPassword) => {
    let url = baseUrl + 'api/auth/change_password';

    let body = {
        old_pass: oldPassword,
        new_pass: newPassword,
        con_pass: confirmPassword
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

export const setSecurityQuestion = async (token, answers) => {
    let url = baseUrl + 'api/securityquestionanswers';

    let body = answers;

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


export const addNewStaff = async(token, firstName, lastName, email, phone, address) =>{
    let url = baseUrl + 'api/auth/register_staff';
    let body = {
        first_name: firstName,
        last_name: lastName,
        email: email,
        phone_number: phone,
        address: address,
    }

    let config = {
        headers: {
            'Authorization': 'Token ' + token
        }
    };

    return axios.post(url, body, config)
        .then(res => res.data);

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
