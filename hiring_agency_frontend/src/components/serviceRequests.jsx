import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { getAllServiceRequests } from "../api/serviceRequests";
import { getAuthToken } from "../utils/storage";
import ServiceRequestCard from "./serviceRequestCard";

function ServiceRequests() {
    const [serviceRequests, setServiceRequests] = useState([]);
    const [showAssigned, setShowAssinged] = useState(false);
    const [showCompleted, setShowCompleted] = useState(false);

    useEffect(() => {
        getAllServiceRequests(getAuthToken(), showAssigned, showCompleted)
            .then(res => setServiceRequests(res));
    }, [showAssigned, showCompleted]);

    const getListOrEmpty = () => {
        if(serviceRequests.length === 0) {
            return <h2 className="text-center">Nothing to show</h2>
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
            <div className="col-md-3">
                <div class="form-check form-switch">
                    <label class="form-check-label">Show assigned</label>
                    <input 
                        value={ showAssigned } 
                        onChange={ event => {
                            if(showAssigned) {
                                setShowCompleted(false);
                            }

                            setShowAssinged(!showAssigned);
                        }} 
                        className="form-check-input" 
                        type="checkbox" 
                        role="switch" 
                        checked={ showAssigned ? 'checked' : '' }
                    />
                </div>
                <div class="form-check form-switch">
                    <label class="form-check-label">Show completed</label>
                    <input 
                        value={ showCompleted } 
                        onChange={ event => {
                            setShowCompleted(!showCompleted);
                            setShowAssinged(true);
                        }}
                        className="form-check-input" 
                        type="checkbox" 
                        role="switch" 
                        checked={ showCompleted ? 'checked' : '' }
                    />
                </div>
            </div>
            <div className="col-md-6">
                { getListOrEmpty() }
            </div>
        </div>
    );
}

export default ServiceRequests;
