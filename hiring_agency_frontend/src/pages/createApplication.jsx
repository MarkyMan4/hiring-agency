import React, { useState } from "react";
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { sendApplication } from "../api/applicationApi";

const educationTypeLookup = {
    '1': [
        {
            id: '1',
            value: 'Bachelors'
        },
        {
            id: '2',
            value: 'Masters'
        }
    ],
    '2': [
        {
            id: '1',
            value: 'Bachelors'
        },
        {
            id: '2',
            value: 'Masters'
        }
    ],
    '3': [
        {
            id: '2',
            value: 'Masters'
        },
        {
            id: '3',
            value: 'PHD'
        }
    ]
}

function CreateAdvertisement() {
    const [email, setEmail] = useState('');
    const [gender, setGender] = useState('Male');
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
    const [message, setMessage] = useState({});
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
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

    const firstNameChanged = (event) => {
        setFirstName(event.target.value);
    }

    const lastNameChanged = (event) => {
        setLastName(event.target.value);
    }

    const { jobid } = useParams();

    const handleFormSubmit = (event) => {
        //check input
        event.preventDefault(); // don't refresh page on form submit
        
        if (email === "" || gender === -1) {
            alert("Make sure experiance required is filled in");
            return;
        }

        //if correct send data
        sendApplication(jobid, email, gender, dateOfBirth, ssn, serviceType, educationType, educationInstitution, graduationYear, graduationMonth, yearsOfExperiance, address, phoneNum, firstName, lastName)
            .then(res => navigate('/create_application_success')) // redirect to success page if request was successful
            .catch(err => {
                const errorResponse = JSON.parse(err.request.response);
                console.log(err.response);

                if (errorResponse.error) {
                    setMessage(errorResponse.error)
                }
                else {
                    setMessage(err.response.data);
                }
            });
    }


    return (
        <div className="mb-5">
            <h1> Please fill in the following form to apply to this job</h1>
            <hr />
            <form id="newApplicationPostForm container-fluid" onSubmit={handleFormSubmit} className="basic-form">
                <label>First Name </label><br />
                <input type="text" name="email" onChange={firstNameChanged} className="form-control mt-2" required></input>
                
                <label className="mt-3">Last Name </label><br />
                <input type="text" name="email" onChange={lastNameChanged} className="form-control mt-2" required></input>

                <label className="mt-3">Email: </label><br />
                <input type="text" name="email" onChange={emailChanged} className="form-control mt-2" required></input>

                <label className="mt-3">Gender </label><br />
                <select id="gender" onChange={genderChanged} value={gender} name="gender" className="form-select mt-2" required>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>

                <label className="mt-3">Date of Birth: </label><br />
                <input type="date" name="description" onChange={dateOfBirthChanged} className="form-control mt-2" required></input>

                <label className="mt-3">SSN</label><br />
                <input type="text" onChange={ssnChanged} maxLength={9} minLength={9} placeholder="exactly 9 digits, no hyphens or spaces" className="form-control mt-2" required></input>

        
                <label className="mt-3">Service Type </label><br />
                <select id="gender" onChange={serviceTypeChanged} name="gender" className="form-select mt-2" required>
                    <option value="1">Nurse</option>
                    <option value="2">Physiotherapist</option>
                    <option value="3">Psychiatrists</option>
                </select>
        
                <label className="mt-3">Education Type </label><br />
                <select id="gender" onChange={educationTypeChanged} name="gender" className="form-select mt-2" required>
                { educationTypeLookup[serviceType].map(e => <option value={e.id}>{ e.value }</option>) }
                </select>
                
                <label className="mt-3">Educational Institution</label><br />
                <input type="text" onChange={educationInstitutionChanged} className="form-control mt-2" required></input>
            
                <label className="mt-3">Graduation Year</label><br />
                <input type="text" onChange={graduationYearChanged} className="form-control mt-2" required></input>            
            
                <label className="mt-3">Graduation Month</label><br />
                <input type="text" onChange={graduationMonthChanged} className="form-control mt-2" required></input>

                <label className="mt-3">Years of Experience</label><br />
                <input type="number" min={0} onChange={yearsOfExperianceChanged} className="form-control mt-2" required></input>
            
                <label className="mt-3">Phone Number</label><br />
                <input onChange={phoneNumChanged} placeholder="only enter digits, e.g. 1234567890" maxLength={10} minLength={10} type="tel" className="form-control mt-2" required></input>

                <label className="mt-3">Address</label><br />
                <input type="text" onChange={adressChanged} className="form-control mt-2" required></input>

                <div className="text-danger mt-3">{Object.keys(message).map((msg, idx) => <p key={idx}><b>{ msg }: </b>{message[msg]}</p>)}</div>

                <button type="submit" className="btn btn-primary mt-2">Submit</button>
            </form>
        </div>
    )
}

export default CreateAdvertisement;
