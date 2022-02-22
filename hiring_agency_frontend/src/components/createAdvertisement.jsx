import React, { useEffect, useState } from "react";
import { getSecurityQuestionsForUser, getUser, lockAccount, login } from "../api/authRequests";
import { setAuthToken } from "../utils/storage";
import { isUserLoggedIn } from "../utils/storage";
import { useNavigate } from 'react-router-dom';
import { sendJobForm } from "../api/jobApi";

function CreateAdvertisement() {
    const [serviceType, setServiceType] = useState(1);
    const [educationType, setEducationType] = useState(1);
    const [experience, setExperience] = useState(-1);
    const [description, setDescription] = useState("");
    const [message, setMessage] = useState('');
    let navigate = useNavigate();

    const validateJobPost = () => {
        //check input
        if(experience == "" || experience == -1){
            alert("Make sure experiance required is filled in");
            return;
        }

        if(description == ""){
            alert("Please add a description");
            return;
        }
        //if correct send data
        sendJobForm(serviceType, educationType, experience, description)
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
    const serviceTypeChanged = (event) => {
        setServiceType(event.target.value);
    }
    const educationTypeChanged = (event) => {
        setEducationType(event.target.value);
    }
    const experienceChanged = (event) => {
        setExperience(event.target.value);
    }
    const descriptionChanged = (event) => {
        setDescription(event.target.value);
    }

    return (
        <div className="row w-100 mt-5">
            <div className="col-md-4"></div>
            <div className="col-md-4 text-center  shadow">
                <form id="newjobpostform container-fluid" className="form-data">
                    <div className="row mx-2">
                        <label>Job Type: </label>
                        <select id="jobtype" onChange={serviceTypeChanged} name="serviceType" form="newjobpostform" required>
                            <option value="1">Nurse</option>
                            <option value="2">Physiotherapist</option>
                        </select>
                    </div>
                    <div className="row mx-2">
                        <label>Education Level Required: </label>
                        <select id="jobtype" name="educationType" onChange={educationTypeChanged} form="newjobpostform" required>
                            <option value="1">Bachelors</option>
                            <option value="2">Masters</option>
                        </select>
                    </div>
                    <div className="row mx-2">
                        <label>Experience Required (Years)</label>
                        <input type="text" name="experiance" onChange={experienceChanged} required></input>
                    </div>
                    <div className="row mx-2">
                        <label>Description</label>
                        <input type="text" name="description" onChange={descriptionChanged} required></input>
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
