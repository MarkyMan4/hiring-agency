import React from "react";
import { Link } from "react-router-dom";

function CareTakerRequestCard({ requestId, firstName, lastName, dateRequested }) {
    return (
        <div className="care-taker-request-card shadow">
            <Link to={ '/pending_caretaker_requests/' + requestId }><h4>{ firstName } { lastName }</h4></Link>
            <hr />
            <p><b>Date requested:</b> { dateRequested }</p>
        </div>
    );
}

export default CareTakerRequestCard;
