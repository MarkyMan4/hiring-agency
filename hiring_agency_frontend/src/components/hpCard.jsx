import React from "react";
import { Link } from "react-router-dom";

function HpCard({ hpId, name }) {
    return (
        <div className="staff-card shadow animate__animated animate__fadeInUp">
            <h5><Link to={ '/healthcare_professionals/' + hpId }>{ name }</Link></h5> 
        </div>
    );
}

export default HpCard;
