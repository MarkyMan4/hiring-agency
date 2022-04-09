

import axios from 'axios';
import { baseUrl } from './config';



export const getHPList = async (token, eligibleForRequest=null) => {
    let url = `${baseUrl}api/hp_requests`;

    let query_params = [];

    if(eligibleForRequest !== null) {
        query_params.push('eligibleForRequest=' + eligibleForRequest);
    }

    if(query_params.length > 0) {
        url += '?' + query_params.join('&');
    }

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

export const getHpSchedule = async (token, hpId) => {
    let url = `${baseUrl}api/hp_requests/${hpId}/schedule`;

    let config = {
        headers: {
            'Authorization': 'Token ' + token
        }
    };

    return axios.get(url, config)
        .then(res => res.data)
        .catch(err => `Failed to retrieve schedule for HP with ID ${hpId}`);
}

export const getHpServiceRequests = async (token, hpId) => {
    let url = `${baseUrl}api/hp_requests/${hpId}/serviceRequest`;

    let config = {
        headers: {
            'Authorization': 'Token ' + token
        }
    };

    return axios.get(url, config)
        .then(res => res.data)
        .catch(err => `Failed to retrieve schedule for HP with ID ${hpId}`);
}