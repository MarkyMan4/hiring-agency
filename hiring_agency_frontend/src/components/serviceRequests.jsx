import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { getAllServiceRequests } from "../api/serviceRequests";
import { getAuthToken } from "../utils/storage";
import ServiceRequestCard from "./serviceRequestCard";

function ServiceRequests() {
    const [serviceRequests, setServiceRequests] = useState([]);

    useEffect(() => {
        getAllServiceRequests(getAuthToken())
            .then(res => setServiceRequests(res));
    }, []);

    const getListOrEmpty = () => {
        if(serviceRequests.length === 0) {
            return <h1 className="text-center">No service requests at this time</h1>
        }
        else {
            return (
                <div>
                    { serviceRequests.map(req => (
                        <ServiceRequestCard 
                            requestId={ req.id }
                            patientName={ req.patient_first_name + ' ' + req.patient_last_name }
                            requesterName={ req.care_taker.user.first_name + ' ' + req.care_taker.user.last_name }
                            requesterUsername={ req.care_taker.user.username }
                            serviceType={ req.service_type.name }
                        />
                    )) }
                </div>
            );
        }
    }

    return (
        <div className="row">
            <h1 className="text-center mb-5">Service requests</h1>
            <div className="col-md-3"></div>
            <div className="col-md-6">
                { getListOrEmpty() }
            </div>
        </div>
    );
}

export default ServiceRequests;
