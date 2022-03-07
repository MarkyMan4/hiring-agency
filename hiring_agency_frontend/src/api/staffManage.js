import axios from 'axios';
import { baseUrl } from './config';

export const getAllStaff = async (token, onlyGetAcitve=null, onlyGetDisActive=null) =>{
    let url = baseUrl + 'api/view_staff_list';

    let query_params = [];

    if(onlyGetAcitve !== null) {
        query_params.push('active=' + (onlyGetAcitve ? 'true' : 'false'));
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
        .catch(err => console.log(err));
}


export const getStaffById = async (token, id) =>{
    let url = baseUrl + 'api/view_staff_list/' + id;

    let config = {
        headers: {
            'Authorization': 'Token ' + token
        }
    };

    return axios.get(url, config)
        .then(res => res.data)
        .catch(err => console.log('Failed to find this staff'));
}


export const changeStaffStatus = async (token, id) =>{
    let url = `${baseUrl}api/view_staff_list/${id}/status`

    let config ={
        headers: {
            'Authorization': 'Token ' + token
        }
    }
    return axios.put(url,{}, config)
        .then(res => res.data)
}