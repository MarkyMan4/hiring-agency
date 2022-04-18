import axios from 'axios';
import { baseUrl } from './config';

export const getLockedList = async (token) => {
    let url = `${baseUrl}api/unlock_user`;

    let config = {
        headers: {
            'Authorization': 'Token ' + token
        }
    };

    return axios.get(url, config)
        .then(res => res.data)
        .catch(err => console.log(err));
}

export const changeToUnlock = async (token, id) => {
    let url = `${baseUrl}api/unlock_user/${id}/unlock`

    let config ={
        headers: {
            'Authorization': 'Token ' + token
        }
    }
    return axios.put(url,{}, config)
        .then(res => res.data)
}