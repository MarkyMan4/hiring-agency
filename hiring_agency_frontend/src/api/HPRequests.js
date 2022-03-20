

import axios from 'axios';
import { baseUrl } from './config';



export const getHPList = async (token, gender=null, minAge=null, maxAge=null, serviceType=null) => {
    let url = `${baseUrl}api/hp_requests`;

    let config = {
        headers: {
            'Authorization': 'Token ' + token
        }
    };

    return axios.get(url, config)
        .then(res => res.data)
        .catch(err => 'Failed to retrieve healthcare professionals');
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