import axios from 'axios';
import { baseUrl } from './config';

export const saveServiceEntry = async (token, serviceRequestId, dateOfService, startTime, endTime, hpId = null) => {
    const url = baseUrl + 'api/service_entry';

    const body = {
        service_request: serviceRequestId,
        date_of_service: dateOfService,
        start_time: startTime,
        end_time: endTime
    }

    if(hpId) {
        body.healthcare_professional = hpId;
    }

    const config = {
        headers: {
            'Authorization': 'Token ' + token
        }
    }

    return axios.post(url, body, config)
        .then(res => res.data);
}
