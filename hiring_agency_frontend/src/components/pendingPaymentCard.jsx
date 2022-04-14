import React from "react";
import { Link } from "react-router-dom";

function PendingPaymentCard({ pendingPayment }) {
    return (
        <div className="care-taker-request-card shadow animate__animated animate__fadeInUp">
            <Link to={ '/payroll/' + pendingPayment.healthcare_professional }><h4>{ pendingPayment.full_name }</h4></Link>
            <hr />
            <p><b>Hourly rate:  </b>${ pendingPayment.hourly_rate }</p>
            <p><b>Amount owed:  </b>${ pendingPayment.amt_owed }</p>
        </div>
    );
}

export default PendingPaymentCard;
