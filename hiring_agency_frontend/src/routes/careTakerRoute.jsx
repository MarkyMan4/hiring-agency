import React from "react";
import { Navigate } from "react-router-dom";

function CareTakerRoute({ children, roles }) {
    if(!(roles.includes('admin') || roles.includes('caretaker'))) {
        return <Navigate to="/" />
    }

    return children;
}

export default CareTakerRoute;
