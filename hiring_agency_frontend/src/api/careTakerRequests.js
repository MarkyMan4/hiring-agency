import axios from 'axios';

const baseUrl = 'http://127.0.0.1:8000/';

export const requestCareTakerAccount = async (firstName, lastName, address, phoneNumber, email) => {
    let url = baseUrl + 'api/create_caretaker_request';

    let body = {
        first_name: firstName,
        last_name: lastName,
        address: address,
        phone_number: phoneNumber,
        email: email
    }

    return axios.post(url, body)
        .then(res => res.data);
}

export const getPendingCareTakerRequests = async (token) => {
    let url = baseUrl + 'api/caretaker_requests';

    let config = {
        headers: {
            'Authorization': 'Token ' + token
        }
    };

    return axios.get(url, config)
        .then(res => res.data)
        .catch(err => console.log('Failed to retrieve care taker requests'));
}

export const approveCareTakerRequest = async (token, requestId) => {
    let url = `${baseUrl}api/caretaker_requests/${requestId}/approve`;

    let config = {
        headers: {
            'Authorization': 'Token ' + token
        }
    };

    return axios.put(url, {}, config)
        .then(res => res.data);
}
