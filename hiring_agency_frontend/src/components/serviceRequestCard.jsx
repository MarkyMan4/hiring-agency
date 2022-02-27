import React from "react";
import { Link } from "react-router-dom";

function ServiceRequestCard({ requestId, patientName, requesterName, requesterUsername, serviceType }) {
    return (
        <div className="care-taker-request-card shadow animate__animated animate__fadeInUp">
            <Link to={ '/service_requests/' + requestId }><h4>{ serviceType }</h4></Link>
            <hr />
            <p><b>Requester name:</b> { requesterName }</p>
            <p><b>Requester username:</b> { requesterUsername }</p>
            <p><b>Patient name:</b> { patientName }</p>
        </div>
    );
}

export default ServiceRequestCard;