import React, { useEffect, useState } from "react";
import { getPendingPayments } from "../api/paymentRequests";
import PendingPaymentCard from "../components/pendingPaymentCard";
import { getAuthToken } from "../utils/storage";

function Payroll() {
    const [pendingPayments, setPendingPayments] = useState([]);

    useEffect(() => {
        getPendingPayments(getAuthToken())
            .then(res => setPendingPayments(res));
    }, []);

    return (
        <div>
            <h1 className="text-center mb-5">Select a healthcare professional to pay</h1>
            <div className="row">
                <div className="col-md-3"></div>
                <div className="col-md-6">
                    { pendingPayments.map(p => <PendingPaymentCard pendingPayment={ p } />) }
                </div>
            </div>
        </div>
    );
}

export default Payroll;
