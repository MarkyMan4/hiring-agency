import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from 'react-router-dom';
import { approveCareTakerRequest } from "../api/careTakerRequests";
import { getAuthToken } from "../utils/storage";

function CareTakerAccountRequestApproved() {
    const { id } = useParams();
    const [email, setEmail] = useState();

    useEffect(() => {
        approveCareTakerRequest(getAuthToken(), id)
            .then(res => setEmail(res.email))
            .catch(err => console.log(err));
    }, []);

    return (
        <div>
            <h1>Request approved and an account has been created</h1>
            <hr />
            <p>{ email ? `An email has been sent to ${email} with the login credentials.` : '' }</p>
        </div>
    );
}

export default CareTakerAccountRequestApproved;
