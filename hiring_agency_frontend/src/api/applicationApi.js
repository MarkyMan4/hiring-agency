import axios from 'axios';
import { baseUrl } from './config';

//todo finish this
export const sendApplication = async (jobPostingID, email, gender, dateOfBirth, ssn, serviceType, educationType, educationInstitution, graduationYear, graduationMonth, yearsOfExperiance, address, phoneNum, firstName, lastName) => {
    let url = baseUrl + 'api/createjobapplications';    
    let body={
        "email" : email,
        "gender" : gender,
        "date_of_birth" : dateOfBirth,
        "ssn": ssn,
        "service_type": serviceType,
        "education_type": educationType,
        "education_institution": educationInstitution,
        "graduation_year": graduationYear,
        "graduation_month": graduationMonth,
        "years_of_experience": yearsOfExperiance,
        "address": address,
        "job": jobPostingID,
        "phone_number": phoneNum,
        "first_name": firstName,
        "last_name": lastName
    }
    
    return axios.post(url, body)
        .then(res => res.data)
}

/*
export const getApplicationList = async () => {
    let url = baseUrl + 'api/applicationApi';


    return axios.get(url)
        .then(res => res.data)
        .catch(err => console.log(err));
}

*/
