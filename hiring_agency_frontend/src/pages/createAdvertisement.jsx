import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { sendJobForm } from "../api/jobApi";

function CreateAdvertisement() {
    const [serviceType, setServiceType] = useState(1);
    const [educationType, setEducationType] = useState(1);
    const [experience, setExperience] = useState(-1);
    const [description, setDescription] = useState("");
    const [message, setMessage] = useState('');
    let navigate = useNavigate();

    const validateJobPost = (event) => {
        event.preventDefault();

        //check input
        if(experience < 0){
            setMessage("Experience must be greater than or equal to 0");
            return;
        }

        if(description.trim() === ""){
            setMessage("Description cannot be empty");
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
        <div>
            <h1>Create job advertisement</h1>
            <p>
                Advertise to hire a healthcare professional
            </p>
            <hr />
            <form id="newjobpostform" className="basic-form" onSubmit={ validateJobPost }>
                <label>Job Type: </label>
                <select onChange={serviceTypeChanged} name="serviceType" className="form-select mt-2" required>
                    <option value="1">Nurse</option>
                    <option value="2">Physiotherapist</option>
                </select>

                <label className="mt-3">Education Level Required</label>
                <select onChange={educationTypeChanged} className="form-select mt-2" required>
                    <option value="1">Bachelors</option>
                    <option value="2">Masters</option>
                </select>

                <label className="mt-3">Experience Required (Years)</label>
                <input type="number" name="experiance" min={0} onChange={experienceChanged} className="form-control mt-2" required></input>

                <label className="mt-3">Description</label>
                <input type="text" name="description" onChange={descriptionChanged} className="form-control mt-2" required></input>

                <button type="submit" className="btn btn-success mt-3">Submit</button>

                <div className="text-danger mt-3">{ message }</div>
            </form>
        </div>
    )
}

export default CreateAdvertisement;
