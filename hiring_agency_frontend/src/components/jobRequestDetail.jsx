import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { viewAdvertisementRequestById } from "../api/advertisementRequest ";
import { getAuthToken } from "../utils/storage";

function JobRequestDetail(){
    const { id } = useParams();
    const navigate = useNavigate();
    const [request, setRequest] = useState({});

    useEffect(() => {
        viewAdvertisementRequestById(getAuthToken().id)
            .then(res => setRequest(res));
    }, []);

    const approve = () =>{
        navigate(`/job_advertisement_request/${id}/approve`);
    }

    const reject = () =>{
        navigate(`/job_advertisement_request/${id}/reject`);
    }

    return(
        <div>
            <h1>Job request</h1>
            <hr/>
            <p><b>Job type: </b>{request.job.service_type.name}</p>
            <p><b>Education: </b>{request.job.education_type.name}</p>
            <p><b>Experience year(s): </b>{request.job.years_experience_required}</p>
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
            <p><b>Job Type: </b>{ request.service_type.name }</p>
            <p><b>Education: </b>{ request.education_typ.name }</p>
            <p><b>Education institution: </b>{ request.education_institution }</p>
            <p><b>Graduation time: </b>{ request.graduation_year } {request.graduation_month}</p>
            <p><b>Experience year(s): </b>{ request.years_of_experience }</p>
            <button onClick={ approve } className="btn btn-outline-success">Approve</button>
            <button onClick={ reject } className="btn btn-outline-danger m-3">Reject</button>
    
        </div>
    );
}

export default JobRequestDetail;
