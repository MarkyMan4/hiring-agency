import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { getPendingCareTakerRequestById } from "../api/careTakerRequests";
import { getAuthToken } from "../utils/storage";
import CancelButton from "../components/cancelButton";

function CareTakerAccountRequestDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [request, setRequest] = useState({});

    useEffect(() => {
        getPendingCareTakerRequestById(getAuthToken(), id)
            .then(res => setRequest(res));
    }, []);

    const approveRequest = () => {
        navigate(`/pending_caretaker_requests/${id}/approve`);
    }

    const rejectRequest = () => {
        navigate(`/pending_caretaker_requests/${id}/reject`);
    }

    return (
        <div>
            <div className="row">
                <div className="col-md-6">
                    <h1>Care Taker Account Request</h1>
                </div>
                <div className="col-md-6">
                    <CancelButton returnUrl="/pending_caretaker_requests" style={ {float: 'right'} } />
                </div>
            </div>
            <hr />
            <p><b>Name: </b>{ request.first_name } { request.last_name }</p>
            <p><b>Address: </b>{ request.address }</p>
            <p><b>Phone number: </b>{ request.phone_number }</p>
            <p><b>Email: </b>{ request.email }</p>
            <p><b>Date requested: </b>{ request.date_requested }</p>
            <button onClick={ approveRequest } className="btn btn-outline-success">Approve</button>
            <button onClick={ rejectRequest } className="btn btn-outline-danger m-3">Reject</button>
        </div>
    );
}

export default CareTakerAccountRequestDetail;
