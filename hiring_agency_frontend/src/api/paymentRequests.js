import axios from 'axios';
import { baseUrl } from './config';

export const getPendingPayments = async (token) => {
    let url = `${baseUrl}api/pending_payments`;

    let config = {
        headers: {
            'Authorization': 'Token ' + token
        }
    };

    return axios.get(url, config)
        .then(res => res.data)
        .catch(err => 'Failed to retrieve pending payments');
}

export const retrievePendingPayment = async (token, hpId) => {
    let url = `${baseUrl}api/pending_payments/${hpId}`;

    let config = {
        headers: {
            'Authorization': 'Token ' + token
        }
    };

    return axios.get(url, config)
        .then(res => res.data)
        .catch(err => 'Failed to retrieve pending payment');
}

export const payHealthPro = async (token, hpId, amount) => {
    let url = `${baseUrl}api/hp_payments`;

    let body = {
        healthcare_professional: hpId,
        amount: amount
    }

    let config = {
        headers: {
            'Authorization': 'Token ' + token
        }
    };

    return axios.post(url, body, config)
        .then(res => res.data)
        .catch(err => 'Failed to pay health pro');
}

export const getPayrollHistory = async (token, hpId=null) => {
    let url = `${baseUrl}api/hp_payments`;

    if(hpId) {
        url += `?hp=${hpId}`;
    }

    let config = {
        headers: {
            'Authorization': 'Token ' + token
        }
    };

    return axios.get(url, config)
        .then(res => res.data)
        .catch(err => 'Failed to payroll history');
}
