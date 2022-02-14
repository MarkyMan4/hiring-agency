import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { getPendingCareTakerRequests } from "../api/careTakerRequests";
import { getAuthToken } from "../utils/storage";
import CareTakerRequestCard from "./careTakerRequestCard";

function PendingCareTakerRequests() {
    const [pendingRequests, setPendingRequests] = useState([]);

    useEffect(() => {
        getPendingCareTakerRequests(getAuthToken())
            .then(res => setPendingRequests(res));
    }, []);

    return (
        <div className="row">
            <div className="col-md-3"></div>
            <div className="col-md-6">
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
        </div>
    );
}

export default PendingCareTakerRequests;
