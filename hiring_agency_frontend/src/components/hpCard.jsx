import React from "react";

function HpCard({ name }) {
    return (
        <div className="staff-card shadow animate__animated animate__fadeInUp">
            <h5>{ name }</h5>
            {/* <h5>Username: <Link to={ '/view_caretaker_list/' + requestId }>{username} </Link> <a style={{float: 'right'}}>Status: { status } </a>  </h5>  */}
        </div>
    );
}

export default HpCard;
