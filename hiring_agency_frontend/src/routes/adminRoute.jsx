import React from "react";
import { Navigate } from "react-router-dom";

function AdminRoute({ children, roles }) {
    if(!roles.includes('admin')) {
        return <Navigate to="/" />
    }

    return children;
}

export default AdminRoute;
