import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { getAllAdvertisementRequest} from "../api/advertisementRequest"
import { getAuthToken } from "../utils/storage";
import JobRequestCard from "./jobRequestCard";

function JobRequestList(){
    const [pendingRequests, setPendingRequests] = useState([]);

    useEffect (() =>{
        getAllAdvertisementRequest(getAuthToken())
            .then(res => setPendingRequests(res));
    }, []);

    const getJobRequest = () =>{
        console.log(pendingRequests)
        if(pendingRequests.length > 0){
            return(
                <div>
                    {
                        pendingRequests.map((req, indx) => {
                            return <JobRequestCard 
                                key={ indx } 
                                requestId={ req.id } 
                                firstName={ req.first_name }
                                lastName={ req.last_name }
                                jobType={ req.job.service_type.name }
                            />
                        }) 
                    }
                </div>
            );
        }
        else{
            return <h1 className="text-center">There are no request now</h1>
        }
    }
    return(
        <div className="row">
            <h1 className="text-center mb-5">Job requests</h1>
            <div className="col-md-3"></div>
            <div className="col-md-6">
                { getJobRequest() }
            </div>
        </div>
    );
}

export default JobRequestList; 