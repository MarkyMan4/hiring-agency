import React from "react";
import { Link } from "react-router-dom";

function JobRequestCard({ requestId, firstName, lastName, jobType}) {
    return (
        <div className="care-taker-request-card shadow animate__animated animate__fadeInUp">
            <Link to={ '/hp_job_application/' + requestId }><h4>{ firstName } { lastName }</h4></Link>
            <hr />
            <p><b>Job type:  </b>{ jobType }</p>
        </div>
    );
}

export default JobRequestCard;