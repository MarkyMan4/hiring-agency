import axios from 'axios';
import { baseUrl } from './config';


export const retrieveHPByServiceAsisgnment = async (token, serviceAssignmentID) => {
    let url = `${baseUrl}api/retrieve_service_requests/${serviceAssignmentID}/get_assign_by_request`;

    let config = {
        headers: {
            'Authorization': 'Token ' + token
        }
    };

    return axios.get(url, config)
        .then(res => res.data)
        .catch(err => `Failed to retrieve service request with ID ${serviceAssignmentID}`);
}


export const unassignHpToServiceRequest = async(token, serviceAssignmentID) => {
    let url = `${baseUrl}api/service_assignments/${serviceAssignmentID}`;

    let config = {
        headers: {
            'Authorization': 'Token ' + token
        }
    };

    return axios.delete(url, config)
        .then(res => res.data)
        .catch(err => `Failed to delete service request with ID ${serviceAssignmentID}`);
}


export const assignHpToServiceRequest = async (token, serviceRequestId, hpId, timeSlots) => {
    const url = baseUrl + 'api/create_service_assignment';

    const body = {
        healthcare_professional: hpId,
        service_request: serviceRequestId,
        time_slots: timeSlots
    }

    const config = {
        headers: {
            'Authorization': 'Token ' + token
        }
    }

    return axios.post(url, body, config)
        .then(res => res.data);
}
