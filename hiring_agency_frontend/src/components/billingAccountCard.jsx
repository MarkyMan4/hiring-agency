import React from "react";
import { Link } from "react-router-dom";

function BillingAccountCard({ acctId, patientName, amtPaid, amtToBePaid }) {
    return (
        <div className="care-taker-request-card shadow animate__animated animate__fadeInUp">
            <h4>Patient: <Link to={ '/billing_accounts/' + acctId }>{ patientName }</Link></h4>
            <hr />
            <p><b>Amount paid:</b> ${ amtPaid }</p>
            <p><b>Amount to be paid:</b> ${ amtToBePaid }</p>
        </div>
    );
}

export default BillingAccountCard;