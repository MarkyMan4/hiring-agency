import axios from 'axios';

const baseUrl = 'http://127.0.0.1:8000/';

//todo finish this
export const sendApplication = async (type, education, experience, description) => {
    let url = baseUrl + 'api/applicationApi';    

    let body={
        "email" : type,
        "gender" : education,
        "date_of_birth" : experience,
        "ssn": description,
        "service_type": description,
        "education_type": description,
        "education_institution": description,
        "graduation_year": description,
        "years-of_experience": description,
        "address": description,
        "job_posting_id": description,
        "phone_number": description
    }
    
    return axios.post(url, body)
        .then(res => res.data)
        .catch(err => console.log(err));
}

/*
export const getApplicationList = async () => {
    let url = baseUrl + 'api/applicationApi';


    return axios.get(url)
        .then(res => res.data)
        .catch(err => console.log(err));
}

*/
