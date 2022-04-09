import React from "react";
import { useNavigate, useParams } from "react-router-dom";

function ServiceEntrySuccess() {
    const navigate = useNavigate();
    const { id } = useParams();

    return(
        <div>
            <h1>Hours of service successfully updated!</h1>
            <hr/>
            
            <button onClick={ () => navigate(`/enter_service/${id}`) } className="btn btn-outline-primary mt-5">Done</button>

        </div>
    )

}
export default ServiceEntrySuccess; 