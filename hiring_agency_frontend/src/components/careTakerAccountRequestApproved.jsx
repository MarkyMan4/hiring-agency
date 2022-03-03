import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from 'react-router-dom';
import { approveCareTakerRequest } from "../api/careTakerRequests";
import { getAuthToken } from "../utils/storage";

function CareTakerAccountRequestApproved() {
    const { id } = useParams();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        approveCareTakerRequest(getAuthToken(), id)
            .then(res => {
                setUsername(res.username);
                setPassword(res.password);
            })
            .catch(err => console.log(err));
    }, []);

    return (
        <div>
            <h1>Request approved and an account has been created</h1>
            <hr />
            <p>
                Username and password below. Please make note of this and send it to the care taker. You will not be able to 
                retrieve the password once you leave this screen.
            </p>
            <p><b>Username: </b>{ username }</p>
            <p><b>Password: </b>{ password }</p>
        </div>
    );
}

export default CareTakerAccountRequestApproved;
