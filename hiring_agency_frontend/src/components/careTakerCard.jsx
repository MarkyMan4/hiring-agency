import React from "react";
import { Link } from "react-router-dom";

function CareTakerCard ({ requestId, username , status}){
    return (
        <div className="staff-card shadow animate__animated animate__fadeInUp">
            <h5>Username: <Link to={ '/view_caretaker_list/' + requestId }>{username} </Link> <a style={{float: 'right'}}>Status: { status } </a>  </h5> 
        </div>
    );
}

export default CareTakerCard;