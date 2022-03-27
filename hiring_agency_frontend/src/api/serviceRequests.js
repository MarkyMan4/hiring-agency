import axios from 'axios';
import { baseUrl } from './config';

export const requestNewService = async (
    token, careTakerUsername, patientFirstName, patientLastName, patientGender, patientDob, patientPhone, patientEmail, serviceLocation,
    startDate, flexibleHours, serviceStartTime, serviceEndTime, hoursOfService, serviceType, serviceSunday, serviceMonday,
    serviceTuesday, serviceWednesday, serviceThursday, serviceFriday, serviceSaturday, daysOfService, hpGenderRequired, hpMinAge, hpMaxAge) => {
    let url = baseUrl + 'api/create_service_requests';

    let body = {
        care_taker_username: careTakerUsername,
        patient_first_name: patientFirstName,
        patient_last_name: patientLastName,
        patient_gender: patientGender,
        patient_date_of_birth: patientDob,
        patient_phone_number: patientPhone,
        patient_email: patientEmail,
        service_location: serviceLocation,
        start_date: startDate,
        flexible_hours: flexibleHours,
        service_start_time: serviceStartTime,
        service_end_time: serviceEndTime,
        hours_of_service_daily: hoursOfService,
        service_type: serviceType,
        service_needed_sunday: serviceSunday,
        service_needed_monday: serviceMonday,
        service_needed_tuesday: serviceTuesday,
        service_needed_wednesday: serviceWednesday,
        service_needed_thursday: serviceThursday,
        service_needed_friday: serviceFriday,
        service_needed_saturday: serviceSaturday,
        days_of_service: daysOfService,
        hp_gender_required: hpGenderRequired,
        hp_min_age: hpMinAge,
        hp_max_age: hpMaxAge
    };

    let config = {
        headers: {
            'Authorization': 'Token ' + token
        }
    };

    return axios.post(url, body, config)
        .then(res => res.data);
}

export const getAllServiceRequests = async (token, onlyGetAssigned=null, onlyGetCompleted=null) => {
    let url = baseUrl + 'api/retrieve_service_requests';

    let query_params = [];

    if(onlyGetAssigned !== null) {
        query_params.push('is_assigned=' + (onlyGetAssigned ? 'true' : 'false'));
    }

    if(onlyGetCompleted !== null) {
        query_params.push('is_completed=' + (onlyGetCompleted ? 'true' : 'false'));
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
        .catch(err => 'Failed to retrieve service requests');
}

export const retrieveServiceRequest = async (token, requestId) => {
    let url = `${baseUrl}api/retrieve_service_requests/${requestId}`;

    let config = {
        headers: {
            'Authorization': 'Token ' + token
        }
    };

    return axios.get(url, config)
        .then(res => res.data)
        .catch(err => `Failed to retrieve service request with ID ${requestId}`);
}

export const getAssignedTimes = async (token, requestId) => {
    let url = `${baseUrl}api/retrieve_service_requests/${requestId}/assigned_times`;

    let config = {
        headers: {
            'Authorization': 'Token ' + token
        }
    };

    return axios.get(url, config)
        .then(res => res.data)
        .catch(err => `Failed to retrieve assigned times for request ID ${requestId}`);
}
