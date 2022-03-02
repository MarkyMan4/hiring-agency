import React from "react";
import { Link } from "react-router-dom";

function ServiceRequestCard({ requestId, patientName, requesterName, requesterUsername, serviceType }) {
    return (
        <div className="care-taker-request-card shadow animate__animated animate__fadeInUp">
            <h4>Patient: <Link to={ '/service_requests/' + requestId }>{ patientName }</Link></h4>
            <hr />
            <p><b>Service type needed:</b> { serviceType }</p>
            <p><b>Requester name:</b> { requesterName }</p>
            <p><b>Requester username:</b> { requesterUsername }</p>
        </div>
    );
}

export default ServiceRequestCard;