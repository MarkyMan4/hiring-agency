import React from "react";
import { Navigate } from "react-router-dom";

function CareOrStaffRoute({ children, roles }) {
    if(!(roles.includes('admin') || roles.includes('staff') || roles.includes('caretaker'))) {
        return <Navigate to="/" />
    }

    return children;
}

export default CareOrStaffRoute;
