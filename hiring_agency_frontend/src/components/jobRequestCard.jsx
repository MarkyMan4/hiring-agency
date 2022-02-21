import React from "react";
import { Link } from "react-router-dom";

function JobRequestCard({ requestId, firstName, lastName}) {
    return (
        <div className="card shadow">
            <Link to={ '/job_advertisement_request/' + requestId }><h4>{ firstName } { lastName }</h4></Link>
            <hr />
            <p><b>Date requested:</b></p>
        </div>
    );
}

export default JobRequestCard;
