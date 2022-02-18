import React, { useEffect, useState } from "react";
import { getSecurityQuestionsForUser, getUser, lockAccount, login } from "../api/authRequests";
import { setAuthToken } from "../utils/storage";
import { isUserLoggedIn } from "../utils/storage";
import { useNavigate } from 'react-router-dom';
import { sendApplication } from "../api/applicationApi";
function CreateAdvertisement() {
    const [email, setEmail] = useState('');
    const [gender, setGender] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [ssn, setSsn] = useState('');
    const [serviceType, setServiceType] = useState(1);
    const [educationType, setEducationType] = useState(1);
    const [educationInstitution, setEducationInstitution] = useState('');
    const [graduationYear, setGraduationYear] = useState('');
    const [graduationMonth, setGraduationMonth] = useState('');
    const [yearsOfExperiance, setYearsOfExperiance] = useState('');
    const [address, setAddress] = useState('');
    const [phoneNum, setPhoneNum] = useState('');
    const [message, setMessage] = useState('');
    let navigate = useNavigate();

    
    const emailChanged = (event) => {
        setEmail(event.target.value);
    }
    
    const genderChanged = (event) => {
        setGender(event.target.value);
    }
    
    const dateOfBirthChanged = (event) => {
        setDateOfBirth(event.target.value);
    }

    const ssnChanged = (event) => {
        setSsn(event.target.value);
    }

    const serviceTypeChanged = (event) => {
        setServiceType(event.target.value);
    }
    const educationTypeChanged = (event) => {
        setEducationType(event.target.value);
    }

    const educationInstitutionChanged = (event) => {
        setEducationInstitution(event.target.value);
    }

    const graduationYearChanged = (event) => {
        setGraduationYear(event.target.value);
    }
    
    const graduationMonthChanged = (event) => {
        setGraduationMonth(event.target.value);
    }

    const yearsOfExperianceChanged = (event) => {
        setYearsOfExperiance(event.target.value);
    }

    const adressChanged = (event) => {
        setAddress(event.target.value);
    }

    const phoneNumChanged = (event) => {
        setPhoneNum(event.target.value);
    }


    const validateJobPost = () => {
        //check input
        if(email == "" || gender == -1){
            alert("Make sure experiance required is filled in");
            return;
        }



        //gete job posting id
        let jobPostingID = 1;


        //if correct send data
        sendApplication(email, gender, dateOfBirth, ssn, serviceType, educationType, educationInstitution, graduationYear, graduationMonth, yearsOfExperiance, address, jobPostingID)
        .then(res => navigate('/create_job_success')) // redirect to success page if request was successful
        .catch(err => {
            const errorResponse = JSON.parse(err.request.response);
            
            if(errorResponse.error) {
                setMessage(errorResponse.error)
            }
            else {
                setMessage('Error creating job request')
            }
        });
    }


    return (
        <div className="row w-100 mt-5">
            <div className="col-md-4"></div>
            <div className="col-md-4 text-center  shadow">
                <form id="newApplicationPostForm container-fluid" className="form-data">
                <div className="row mx-2">
                        <label>Email</label>
                        <input type="text" name="email" onChange={emailChanged} required></input>
                    </div>
                    <div className="row mx-2">
                        <label>Gender </label>
                        <select id="gender" onChange={genderChanged} name="gender" form="newjobpostform" required>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>
                    <div className="row mx-2">
                        <label>Date of Birth: </label>
                        <input type="text" name="description" onChange={dateOfBirthChanged} required></input>
                    </div>

                    <div className="row mx-2">
                        <label>SSN</label>
                        <input type="text"  onChange={ssnChanged} required></input>
                    </div>

                    <div className="row mx-2">
                        <label>Service Type </label>
                        <select id="gender" onChange={serviceTypeChanged} name="gender" form="newjobpostform" required>
                            <option value="Male">Nurse</option>
                            <option value="Female">Professional</option>
                        </select>
                    </div>

                    
                    <div className="row mx-2">
                        <label>Education Type </label>
                        <select id="gender" onChange={educationTypeChanged} name="gender" form="newjobpostform" required>
                            <option value="Male">Masters</option>
                            <option value="Female">Bachelors</option>
                        </select>
                    </div>
                    
                    <div className="row mx-2">
                        <label>Educational Institution</label>
                        <input type="text" onChange={educationInstitutionChanged} required></input>
                    </div>

                    <div className="row mx-2">
                        <label>Graduation Year</label>
                        <input type="text" onChange={graduationYearChanged} required></input>
                    </div>

                    <div className="row mx-2">
                        <label>Graduation Month</label>
                        <input type="text" onChange={graduationMonthChanged} required></input>
                    </div>

                    <div className="row mx-2">
                        <label>Years of Experiance</label>
                        <input type="text" onChange={yearsOfExperianceChanged} required></input>
                    </div>

                    <div className="row mx-2">
                        <label>Address</label>
                        <input type="text" onChange={adressChanged} required></input>
                    </div>

                    <div className="row mx-2">
                        <label>Phone Number: </label>
                        <input type="text" onChange={phoneNumChanged} required>TODO insert job here</input>
                    </div>

                    <div className="row mx-2">
                        <label>Applying for: </label>
                        <input type="text" onChange={adressChanged} required>TODO insert job here</input>
                    </div>

                    <div className="row mt-4 ">
                        <button type="button" onClick={validateJobPost}>Submit</button>
                    </div>

                    <div className="text-danger mt-3">{ message }</div>
                </form>
            </div>
        </div>
    )
}

export default CreateAdvertisement;
