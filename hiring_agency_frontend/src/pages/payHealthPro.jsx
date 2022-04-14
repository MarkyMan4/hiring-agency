import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { payHealthPro, retrievePendingPayment } from "../api/paymentRequests";
import { getAuthToken } from "../utils/storage";
import CancelButton from "../components/cancelButton";

function PayHealthPro() {
    const { id } = useParams();
    const [pendingPayment, setPendingPayment] = useState();
    const [paymentAmt, setPaymentAmt] = useState();
    const [message, setMessage] = useState('');
    const [paidTrigger, setPaidTrigger] = useState(false); // used for triggering useEffect when a payment is made

    useEffect(() => {
        retrievePendingPayment(getAuthToken(), id)
            .then(res => setPendingPayment(res));
    }, [id, paidTrigger]);

    const handleFormSubmit = (event) => {
        event.preventDefault();
        
        if(parseFloat(paymentAmt) > parseFloat(pendingPayment.amt_owed)) {
            setMessage(`Payment must be less than or equal to $${pendingPayment.amt_owed}`);
            return;
        }

        payHealthPro(getAuthToken(), pendingPayment.healthcare_professional, paymentAmt)
            .then(res => {
                setPaymentAmt('');
                setPaidTrigger(!paidTrigger);
                setMessage(`Payment for ${paymentAmt} made`);
            })
            .catch(err => setMessage('Failed to pay healthcare professional, please try again later'));
    }

    return (
        <div>
            <div className="row">
                <div className="col-md-6">
                    <h1>Select payment amount</h1>
                </div>
                <div className="col-md-6">
                    <CancelButton returnUrl="/payroll" style={ {float: 'right'} } />
                </div>
            </div>
            <hr />
            
            <div>
                <div><b>Name: </b>{ pendingPayment?.full_name }</div>
                <div><b>Amount owed: </b>${ pendingPayment?.amt_owed }</div>
            </div>

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

export default PayHealthPro;
