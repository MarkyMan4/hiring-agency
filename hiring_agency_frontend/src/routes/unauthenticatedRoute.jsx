import React from "react";
import { Navigate } from "react-router-dom";

// this makes routes only available to users who are not logged in
function UnauthenticatedRoute({ children, roles }) {
    if(roles.length > 0) {
        return <Navigate to="/" />
    }

    return children;
}

export default UnauthenticatedRoute;
