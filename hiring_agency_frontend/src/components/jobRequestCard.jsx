import React from "react";
import { Link } from "react-router-dom";

function JobRequestCard({ requestId, firstName, lastName, jobType}) {
    return (
        <div className="card shadow">
            <Link to={ '/hp_job_application/' + requestId }><h4>{ firstName } { lastName }</h4></Link>
            <hr />
            <p><b>Job type:  </b>{jobType}</p>
        </div>
    );
}

export default JobRequestCard;