import axios from 'axios';

const baseUrl = 'http://127.0.0.1:8000/';

export const getSecurityQuestionOptions = async () => {
    let url = baseUrl + 'api/securityquestions';

    return axios.get(url)
        .then(res => res.data)
        .catch(err => console.log(err));
}