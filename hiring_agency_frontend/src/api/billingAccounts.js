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
