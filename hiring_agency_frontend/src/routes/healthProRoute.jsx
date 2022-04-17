import React from "react";
import { Navigate } from "react-router-dom";

function HealthProRoute({ children, roles }) {
    if(!(roles.includes('admin') || roles.includes('healthcareprofessional'))) {
        return <Navigate to="/" />
    }

    return children;
}

export default HealthProRoute;
