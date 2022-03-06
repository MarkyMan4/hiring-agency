import axios from 'axios';
import { baseUrl } from './config';


export const retrieveHPByServiceAsisgnment = async (token, serviceID) => {
    let url = `${baseUrl}api/service_assignments/${serviceID}`;

    let config = {
        headers: {
            'Authorization': 'Token ' + token
        }
    };

    return axios.get(url, config)
        .then(res => res.data)
        .catch(err => `Failed to retrieve service request with ID ${serviceID}`);
}



export const assignHpToServiceRequest = async (token, serviceRequestId, hpId) => {
    const url = baseUrl + 'api/create_service_assignment';

    const body = {
        healthcare_professional: hpId,
        service_request: serviceRequestId
    }

    const config = {
        headers: {
            'Authorization': 'Token ' + token
        }
    }

    return axios.post(url, body, config)
        .then(res => res.data);
}
