import React, { useEffect, useState } from "react";
import { getSecurityQuestionsForUser, getUser, lockAccount, login } from "../api/authRequests";
import { setAuthToken } from "../utils/storage";
import { isUserLoggedIn } from "../utils/storage";
import { useNavigate } from 'react-router-dom';

function viewAdvertisement() {
    let navigate = useNavigate();

    const getAllJobs = () => {
        //get jobs from database


        let jobs = [];
        
        jobs.forEach(function(job){
            
        })

    }

    

    return (
        <div className="row w-100 mt-5">
            <div className="col-md-4"></div>
            <div className="col-md-4 text-center login-form shadow">
                { getAllJobs}
            </div>
        </div>
    )
}

export default viewAdvertisement;
