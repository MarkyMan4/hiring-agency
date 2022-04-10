import axios from 'axios';
import { baseUrl } from './config';

export const getAllBillingAccounts = async (token) => {
    const url = baseUrl + 'api/billing_accounts';

    const config = {
        headers: {
            'Authorization': 'Token ' + token
        }
    };

    return axios.get(url, config)
        .then(res => res.data)
        .catch(err => console.log('Failed to retrieve billing accounts'));
}

export const getBillingAccountById = async (token, billingAccountId) => {
    const url = `${baseUrl}api/billing_accounts/${billingAccountId}`;

    const config = {
        headers: {
            'Authorization': 'Token ' + token
        }
    };

    return axios.get(url, config)
        .then(res => res.data)
        .catch(err => 'Failed to retrieve billing account');
}

export const makePayment = async (token, billingAccountId, amt) => {
    const url = `${baseUrl}api/billing_accounts/${billingAccountId}/make_payment`;

    const body = {
        amount: amt
    };

    const config = {
        headers: {
            'Authorization': 'Token ' + token
        }
    };

    return axios.put(url, body, config)
        .then(res => res.data);
}
