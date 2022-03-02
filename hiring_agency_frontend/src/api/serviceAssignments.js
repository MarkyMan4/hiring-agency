import axios from 'axios';
import { baseUrl } from './config';

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
