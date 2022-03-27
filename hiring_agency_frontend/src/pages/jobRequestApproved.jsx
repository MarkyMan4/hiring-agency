import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from 'react-router-dom';
import { approveJobRequest } from "../api/advertisementRequest";
import { getAuthToken } from "../utils/storage";

function ApprovejobRequest() {
    /*const { id } =useParams();
    const [email, setEmail] = useState();

    useEffect(() => {
        approveJobRequest(getAuthToken(), id)
            .then(res => setEmail(res.email))
            .catch(err => console.log(err));
    },[]);*/
    //<p>{ email ? `An email has been sent to ${email} with the login credentials.` : '' }</p>
    return(
        <div>
            <h1>You approved a job request and a heathcare professional account has been created</h1>
            <hr/>
            
            <p>An email has been sent to user with the login credentials.</p>

        </div>
    )

}
export default ApprovejobRequest; 