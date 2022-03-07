import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getBillingAccountById } from "../api/billingAccounts";
import { getAuthToken } from "../utils/storage";
import CancelButton from "./cancelButton";

function BillingAccountDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [billingAccount, setBillingAccount] = useState({});

    useEffect(() => {
        getBillingAccountById(getAuthToken(), id)
            .then(res => setBillingAccount(res));
    }, []);

    const isDataLoaded = () => {
        return Object.keys(billingAccount).length > 0;
    }

    const goToServReqDetails = () => {
        navigate('/service_requests/' + billingAccount.service_request.id);
    }

    const getHtmlOrNone = () => {
        if(isDataLoaded()) {
            return (
                <div className="row mt-4">
                    <div className="col-md-6 mb-3">
                        <div className="service-detail-card shadow animate__animated animate__fadeInLeft">
                            <h3 className="mt-4">Billing Account info</h3>
                            <hr />
                            <b>Hourly rate</b>
                            <p>{ billingAccount.hourly_rate }</p>
                            <b>Amount paid</b>
                            <p>{ billingAccount.amt_paid }</p>
                            <b>Amount to be paid</b>
                            <p>{ billingAccount.amt_to_be_paid }</p>
                        </div>
                    </div>
                    <div className="col-md-6 mb-3">
                        <div className="service-detail-card shadow animate__animated animate__fadeInRight">
                            <h3 className="mt-4">Service request info</h3>
                            <hr />
                            <b>Patient</b>
                            <p>{ billingAccount.service_request.patient_first_name } { billingAccount.service_request.patient_last_name }</p>
                            <b>Service type needed</b>
                            <p>{ billingAccount.service_request.service_type.name }</p>
                            <b>Requester name</b>
                            <p>{ billingAccount.service_request.care_taker.user.first_name } { billingAccount.service_request.care_taker.user.last_name }</p>

                            <button onClick={ goToServReqDetails } className="btn btn-outline-primary mb-4 mt-3">View details</button>
                        </div>
                    </div>
                </div>
            );
        }
        else {
            return null;
        }
    }

    return (
        <div className="row animate__animated animate__fadeIn">
            <div className="col-md-6">
                <h1>Billing account</h1>
            </div>
            <div className="col-md-6">
                <CancelButton returnUrl="/billing_accounts" style={ {float: 'right'} } />
            </div>
            <hr />
            { getHtmlOrNone() }
        </div>
    );
}

export default BillingAccountDetail;
