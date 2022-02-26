import React from "react";

function ServiceRequestCard({ requestId, patientName, requesterName, requesterUsername, serviceType }) {
    return (
        <div className="care-taker-request-card shadow">
            {/* <Link to={ '/pending_caretaker_requests/' + requestId }><h4>{ firstName } { lastName }</h4></Link> */}
            <h4>{ serviceType }</h4>
            <hr />
            <p><b>Requester name:</b> { requesterName }</p>
            <p><b>Requester username:</b> { requesterUsername }</p>
            <p><b>Patient name:</b> { patientName }</p>
        </div>
    );
}

export default ServiceRequestCard;