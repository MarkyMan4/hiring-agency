import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from 'react-router-dom';
import { approveJobRequest } from "../api/advertisementRequest ";
import { getAuthToken } from "../utils/storage";

function ApprovejobRequest() {
    const { id } =useParams();
    const [username, setUsername ] = useState('');
    const [password, setPassword ] = useState('');

    useEffect(() => {
        approveJobRequest(getAuthToken(), id)
            .then(res => {
                setUsername(res.username);
                setPassword(res.password);
            })
            .catch(err => console.log(err));
    },[]);

    return(
        <div>
            <h1>You approved a job request and a heathcare professional account has been created</h1>
            <hr/>
            <p>
                Username and password below. Please record them and send to user.
                If you leave this page, these information will not be shown in the future
            </p>
            <p><b>Username: </b>{ username }</p>
            <p><b>Password: </b>{ password }</p>
            
        </div>
    )

}
export default ApprovejobRequest;