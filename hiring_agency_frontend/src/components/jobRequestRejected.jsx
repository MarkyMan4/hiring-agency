import React from "react";
import { useEffect } from "react";
import { useParams } from 'react-router-dom';
import { rejectJobRequest } from "../api/advertisementRequest ";
import { getAuthToken } from "../utils/storage";

function JobRequestRejected() {
    const { id } = useParams();

    useEffect(() => {
        rejectJobRequest(getAuthToken(), id);
    }, []);

    return (
        <h1>Job request has been rejected</h1>
    );
}

export default JobRequestRejected;
