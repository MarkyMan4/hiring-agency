import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllServiceRequests } from "../api/serviceRequests";
import { getAuthToken } from "../utils/storage";

function HealthProAssignedReqs() {
    const [serviceRequest, setServiceRequests] = useState([]);

    useEffect(() => {
        getAllServiceRequests(getAuthToken())
            .then(res => setServiceRequests(res));
    }, []);

    return (
        <div>
            <h1>Current Assignments</h1>
            <p>Select a service assignment to enter hours worked</p>
            <hr />
            <div className="mt-5">
                {serviceRequest.map(sr => {
                    return (
                        <div className="care-taker-request-card shadow animate__animated animate__fadeInUp">
                            <h4>Patient: <Link to={ '/enter_service/' + sr.id }>{ sr.patient_first_name } { sr.patient_last_name }</Link></h4>
                            <hr />
                            <p><b>Start date:</b> { sr.start_date }</p>
                            <p><b>Days of service:</b> { sr.days_of_service }</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default HealthProAssignedReqs;
