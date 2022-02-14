import React from "react";

function CareTakerRequestCard({ requestId, firstName, lastName, dateRequested }) {
    return (
        <div className="care-taker-request-card shadow">
            <h4>{ firstName } { lastName }</h4>
            <hr />
            <p><b>Date requested:</b> { dateRequested }</p>
        </div>
    );
}

export default CareTakerRequestCard;
