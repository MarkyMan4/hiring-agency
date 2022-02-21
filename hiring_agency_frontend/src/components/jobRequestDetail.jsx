import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { viewAdvertisementRequestById } from "../api/advertisementRequest ";
import { getAuthToken } from "../utils/storage";

function JobRequestDetail(){
    const { id } = useParams();
    const navigate = useNavigate();
    const [request, setRequest] = useState({});

    useEffect(() => {
        viewAdvertisementRequestById(getAuthToken(), id)
            .then(res => setRequest(res));
    }, []);

    const approve = () =>{
        navigate(`/job_advertisement_request/${id}/approve`);
    }

    const reject = () =>{
        navigate(`/job_advertisement_request/${id}/reject`);
    }

    const cancel = () => {
        navigate('/job_advertisement_request');
    }

    if(Object.keys(request).length !== 0){
        console.log("true")
    }
    else{
        console.log("false")
    }
    console.log(request);

    console.log("logs");
    if(Object.keys(request).length !== 0){
        return(
            <div>
                <div className="row">
                    <div className="col-md-6">
                        <h1>Job</h1>
                    </div>
                    <div className="col-md-6">
                        <button onClick={ cancel } className="btn btn-outline-primary" style={ {float: 'right'} }>Cancel</button>
                    </div>
                </div>
                <hr/>
                <p><b>Job type: </b>{request.job.service_type.name}</p>
                <p><b>Education required: </b>{request.job.education_type.name}</p>
                <p><b>Year(s) of experience required: </b>{request.job.years_experience_required}</p>
                <p><b>Description: </b>{request.job.description}</p>
                <hr/>
                <h1>Information of the applicant</h1>
                <hr/>   
                <p><b>Name: </b>{ request.first_name } { request.last_name }</p>
                <p><b>Gender: </b>{ request.gender }</p>
                <p><b>Birthday: </b>{ request.date_of_birth }</p>
                <p><b>Phone number: </b>{ request.phone_number }</p>
                <p><b>Email: </b>{ request.email }</p>
                <p><b>SSN: </b>{ request.ssn }</p>
                <p><b>Address: </b>{ request.address }</p>
                <p><b>Job type: </b>{ request.service_type.name }</p>
                <p><b>Education: </b>{ request.education_type.name }</p>
                <p><b>Education institution: </b>{ request.education_institution }</p>
                <p><b>Graduation month and year: </b>{ request.graduation_month } / {request.graduation_year}</p>
                <p><b>Experience year(s): </b>{ request.years_of_experience }</p>
                <button onClick={ approve } className="btn btn-outline-success">Approve</button>
                <button onClick={ reject } className="btn btn-outline-danger m-3">Reject</button>
        
            </div>
        );
    }
    else{
        return(
            <div>
            <h1>Loading...</h1>
            </div>
        );    
    }
    
}

export default JobRequestDetail;
