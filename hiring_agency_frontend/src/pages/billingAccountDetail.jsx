import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getBillingAccountById, makePayment } from "../api/billingAccounts";
import { getAuthToken } from "../utils/storage";
import {terminateServiceRequest} from "../api/serviceRequests";
import CancelButton from "../components/cancelButton";

function BillingAccountDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [billingAccount, setBillingAccount] = useState({});
    const [paymentTrigger, setPaymentTrigger] = useState(false); // flips whenever a payment is made so we can retrieve the updated amt to be paid
    const [paymentAmt, setPaymentAmt] = useState();
    const [message, setMessage] = useState('');
    const [terminateClicked, setTerminateClicked] = useState(false);
    useEffect(() => {
        getBillingAccountById(getAuthToken(), id)
            .then(res => setBillingAccount(res));
    }, [id, paymentTrigger, terminateClicked]);


    const isDataLoaded = () => {
        return Object.keys(billingAccount).length > 0;
    }

    const goToServReqDetails = () => {
        navigate('/ct_service_requests/' + billingAccount.service_request.id);
    }

    const handleFormSubmit = (event) => {
        event.preventDefault();
        if(paymentAmt > parseFloat(billingAccount.amt_to_be_paid).toFixed(2) ){
           setMessage("Please dont overpay, although we appreciate the gesture");
            return;
        }
        makePayment(getAuthToken(), id, paymentAmt)
            .then(res => {
                setMessage(`Payment made for $${paymentAmt}`);
                setPaymentAmt('');
                setPaymentTrigger(!paymentTrigger);
            })
            .catch(err => setMessage('Failed to make payment'));
    }


    
const getTerminateButton=()=>{
    if(billingAccount.service_request?.is_completed){
    return <div ><button className="btn btn-danger disabled" >Terminate</button> <p style={{fontSize: "10px"}}> "This account has already been completed or terminated"</p> </div>
    }else if(parseFloat(billingAccount.amt_to_be_paid).toFixed(2) == 0){
      return <button className="btn btn-danger" onClick={terminateServReq}>Terminate</button>    
    }else{
        return <div ><button className="btn btn-danger disabled" >Terminate</button> <p style={{fontSize: "10px"}}> "Please pay amount owed before terminating service"</p> </div>
    }

}

const terminateServReq=()=>{
    console.log(id);
    console.log(billingAccount);
    terminateServiceRequest(getAuthToken(), billingAccount.service_request.id)
        .then(res => setTerminateClicked(true));  //navigate('/ct_service_requests/' + billingAccount.service_request.id)
}




    const getHtmlOrNone = () => {
        if(isDataLoaded()) {
            return (
                <div>
                    <div className="row mt-4 mb-3">
                        <div className="col-md-6 mb-3">
                            <div className="service-detail-card shadow animate__animated animate__fadeInLeft">
                                <h3 className="mt-4">Billing Account info</h3>
                                <hr />
                                <b>Amount paid</b>
                                <p>${ parseFloat(billingAccount.amt_paid).toFixed(2) }</p>
                                <b>Amount to be paid</b>
                                <p>${ parseFloat(billingAccount.amt_to_be_paid).toFixed(2) }</p>
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
                    <h2>Make a payment</h2>
                    <hr />
                    <form onSubmit={handleFormSubmit} className="basic-form">
                        <label className="mt-3">Amount</label>
                        <input 
                            type="number" 
                            step="0.01" 
                            value={ paymentAmt } 
                            onChange={ (event) => { setPaymentAmt(event.target.value); setMessage(''); } } 
                            className="form-control mt-2" 
                            min={ 0.01 }
                            required 
                        />

                        <button type="submit" className="btn btn-primary mt-4">Submit</button>
                    </form>
                    <div className="mt-3 mb-5">{ message }</div>
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
                {
                  getTerminateButton()
                }
                <CancelButton returnUrl="/billing_accounts" style={ {float: 'right'} } />
            </div>
            <hr />
            { getHtmlOrNone() }
        </div>
    );
}

export default BillingAccountDetail;
