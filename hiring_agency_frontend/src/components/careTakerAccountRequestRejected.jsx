import React from "react";
import { useEffect } from "react";
import { useParams } from 'react-router-dom';
import { rejectCareTakerRequest } from "../api/careTakerRequests";
import { getAuthToken } from "../utils/storage";

function CareTakerAccountRequestRejected() {
    const { id } = useParams();

    useEffect(() => {
        rejectCareTakerRequest(getAuthToken(), id);
    }, []);

    return (
        <h1>Care taker account has been rejected</h1>
    );
}

export default CareTakerAccountRequestRejected;
