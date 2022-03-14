import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { getPendingCareTakerRequests } from "../api/careTakerRequests";
import { getAuthToken } from "../utils/storage";
import CareTakerRequestCard from "../components/careTakerRequestCard";

function PendingCareTakerRequests() {
    const [pendingRequests, setPendingRequests] = useState([]);

    useEffect(() => {
        getPendingCareTakerRequests(getAuthToken())
            .then(res => setPendingRequests(res));
    }, []);

    const getRequestListOrNoneMessage = () => {
        if(pendingRequests.length > 0) {
            return (
                <div>
                    { 
                        pendingRequests.map((req, indx) => {
                            return <CareTakerRequestCard 
                                key={ indx } 
                                requestId={ req.id } 
                                firstName={ req.first_name }
                                lastName={ req.last_name }
                                dateRequested={req.date_requested}
                            />
                        }) 
                    }
                </div>
            );
        }
        else {
            return <h1 className="text-center">No requests at this time</h1>
        }
    }

    return (
        <div className="row">
            <h1 className="text-center mb-5">Care taker account requests</h1>
            <div className="col-md-3"></div>
            <div className="col-md-6">
                { getRequestListOrNoneMessage() }
            </div>
        </div>
    );
}

export default PendingCareTakerRequests;
