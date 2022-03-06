import React from "react";
import { Link } from "react-router-dom";

function StaffCard ({ requestId, username , status}){
    return (
        <div className="care-taker-request-card shadow animate__animated animate__fadeInUp">
        <h4>Username: <Link to={ '/staff_list/' + requestId }>{username}</Link></h4>
        <hr />
        <p><b>Status:</b> { status }</p>
    </div>
    );
}

export default StaffCard;