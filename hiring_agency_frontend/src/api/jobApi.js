import axios from 'axios';

const baseUrl = 'http://127.0.0.1:8000/';

export const sendJobForm = async (type, education, experience, description) => {
    let url = baseUrl + 'api/jobposting';    

    let body={
        "service_type" : type,
        "education_type" : education,
        "years_experience_required" : experience,
        "description": description
    }
    
    return axios.post(url, body)
        .then(res => res.data)
        .catch(err => console.log(err));
}

export const getJobList = async () => {
    let url = baseUrl + 'api/jobposting';


    return axios.get(url)
        .then(res => res.data)
        .catch(err => console.log(err));
}
