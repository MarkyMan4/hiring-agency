import React from "react";
import { Navigate } from "react-router-dom";

function StaffRoute({ children, roles }) {
    if(!(roles.includes('admin') || roles.includes('staff'))) {
        return <Navigate to="/" />
    }

    return children;
}

export default StaffRoute;
