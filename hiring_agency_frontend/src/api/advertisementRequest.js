import axios from 'axios';
import { baseUrl } from './config';

export const getAllAdvertisementRequest = async (token) =>{
    let url = baseUrl + 'api/hp_job_application';

    let config = {
        headers: {
            'Authorization': 'Token ' + token
        }
    };

    return axios.get(url, config)
        .then(res => res.data)
        .catch(err => console.log(err));
}

export const viewAdvertisementRequestById = async (token, id) =>{
    let url = baseUrl + 'api/hp_job_application/' + id;

    let config = {
        headers: {
            'Authorization': 'Token ' + token
        }
    };

    return axios.get(url, config)
        .then(res => res.data)
        .catch(err => console.log('Failed to find job request'));
}

export const approveJobRequest = async (token, requestId, salary) =>{
    let url = `${baseUrl}api/hp_job_application/${requestId}/approve`;

    let body = {
        salary: salary
    };

    let config ={
        headers: {
            'Authorization': 'Token ' + token
        }
    }
    return axios.post(url,body, config )
        .then(res => res.data)
}

export const rejectJobRequest = async (token, requestId) =>{
    let url = `${baseUrl}api/hp_job_application/${requestId}/reject`

    let config ={
        headers: {
            'Authorization': 'Token ' + token
        }
    }
    return axios.put(url,{}, config)
        .then(res => res.data)
}