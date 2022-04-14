import React, { useEffect, useState } from "react";
import { getPayrollHistory } from "../api/paymentRequests";
import { getAuthToken } from "../utils/storage";

function PayrollHistoryModal({ hpId }) {
    const [display, setDisplay] = useState('none');
    const [payrollHistory, setPayrollHistory] = useState([]);

    useEffect(() => {
        getPayrollHistory(getAuthToken(), hpId)
            .then(res => setPayrollHistory(res));
    }, [hpId]);

    let modalDisplay = {
        display: display
    }

    const toggleModal = () => {        
        if(display === 'none')
            setDisplay('flex');
        else
            setDisplay('none');
    }

    return (
        <div>
            <button onClick={toggleModal} className="btn btn-success">Payroll Info</button>
            <div className="modal" style={ modalDisplay }>
                <div className="modal-content animate__animated animate__zoomIn">
                    <div>
                        <button onClick={ toggleModal } className="btn btn-outline-danger pb-0 pt-0 pl-2 pr-2">&times;</button>
                    </div>

                    <h1 className="text-center">Payroll History</h1>
                    <hr />

                    <div className="row mt-3">
                        <div className="col-md-3"></div>
                        <div className="col-md-6">
                            <p><b>Total amount paid: </b>${ payrollHistory.reduce((total, payment) => total + parseFloat(payment.amount), 0).toFixed(2) }</p>
                            <table className="table table-striped shadow">
                                <thead>
                                    <tr>
                                        <th scope="col">Payment date</th>
                                        <th scope="col">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { 
                                        payrollHistory.map(ph => (
                                            <tr>
                                                <td>{ ph.date_of_payment }</td>
                                                <td>${ ph.amount }</td>
                                            </tr>
                                        )) 
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PayrollHistoryModal;
