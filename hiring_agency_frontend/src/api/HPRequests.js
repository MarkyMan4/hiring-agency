

import axios from 'axios';
import { baseUrl } from './config';



export const getHPList = async (token, hpID) => {
    let url = `${baseUrl}api/hp_requests`;

    let config = {
        headers: {
            'Authorization': 'Token ' + token
        }
    };

    return axios.get(url, config)
        .then(res => res.data)
        .catch(err => `Failed to retrieve service request with ID ${hpID}`);
}


export const retrieveHP = async (token, hpID) => {
    let url = `${baseUrl}api/hp_requests/${hpID}`;

    let config = {
        headers: {
            'Authorization': 'Token ' + token
        }
    };

    return axios.get(url, config)
        .then(res => res.data)
        .catch(err => `Failed to retrieve service request with ID ${hpID}`);
}