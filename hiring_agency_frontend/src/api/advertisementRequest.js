import axios from 'axios';
const baseUrl = 'http://127.0.0.1:8000/';

export const getAllAdvertisementRequest = async (token) =>{
    let url = baseUrl + 'api/job_advertisement_request';

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
    let url = baseUrl + 'api/job_advertisement_request/'+id;

    let config = {
        headers: {
            'Authorization': 'Token ' + token
        }
    };

    return axios.get(url)
        .then(res => res.data)
        .catch(err => console.log('Failed to find job request'));
}

export const approveJobRequest = async (token, requestId) =>{
    let url = `${baseUrl}api/job_advertisement_request/${requestId}/approve`;

    let config ={
        headers: {
            'Authorization': 'Token ' + token
        }
    }
    return axios.put(url,{}, config)
        .then(res => res.data)
}

export const rejectJobRequest = async (token, requestId) =>{
    let url = `${baseUrl}api/job_advertisement_request/${requestId}/reject`

    let config ={
        headers: {
            'Authorization': 'Token ' + token
        }
    }
    return axios.put(url,{}, config)
        .then(res => res.data)
}