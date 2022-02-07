import { getUser } from "../api/authRequests";

export const setAuthToken = (value) => {
    localStorage.setItem('token', value);
}

export const getAuthToken = () => {
    return localStorage.getItem('token');
}

export const destroyAuthToken = () => {
    localStorage.removeItem('token');
}

export const isUserLoggedIn = () => {
    if(getAuthToken()) {
        return getUser()
            .then(res => true)
            .catch(err => false);
    }

    return false;
}
