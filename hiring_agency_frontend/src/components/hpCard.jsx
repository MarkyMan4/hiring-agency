import React from "react";
import { Link } from "react-router-dom";

function HpCard({ hpId, name, status }) {
    return (
        <div className="staff-card shadow animate__animated animate__fadeInUp">
            <h5><Link to={ '/healthcare_professionals/' + hpId }>{ name }</Link><a style={{float: 'right'}}>Status: { status } </a></h5> 
        </div>
    );
}

export default HpCard;
