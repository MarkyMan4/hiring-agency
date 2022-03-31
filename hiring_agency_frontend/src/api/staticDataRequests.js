import axios from 'axios';
import { baseUrl } from './config';

export const getSecurityQuestionOptions = async () => {
    let url = baseUrl + 'api/securityquestions';

    return axios.get(url)
        .then(res => res.data)
        .catch(err => console.log(err));
}

export const getServiceTypes = async () => {
    let url = baseUrl + 'api/service_types';

    return axios.get(url)
        .then(res => res.data)
        .catch(err => console.log(err));
}
