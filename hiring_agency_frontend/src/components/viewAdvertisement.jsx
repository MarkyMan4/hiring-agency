import React, { Component } from 'react'
import { getJobList } from "../api/jobApi.js";
import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import { useEffect } from "react";

function ViewAdvertisement(){

        const [advertisements, setAdvertisements] = useState([]);
        let navigate = useNavigate();
        useEffect(() => {
            getJobList().then(res => setAdvertisements(res));
        }, []);
    
        const routeChange = (path) =>{ 
            
            return function () {
                // you code 
                navigate(path);
             }
            //
          }

        const getAdvertisementsHTML = () => {
            if(advertisements.length > 0) {
                return (
                    <div>
                        <ul className="no-bulletpoints">
                        {   
                            advertisements.map((job,idx)  => (
                                <div className="row mt-4">
                                    <div className="col">
                                        <li key={idx} className="advertisement-job-card">
                                            <h3>{job.service_type.name}</h3>
                                            <label>Description:</label> {job.description} <br></br>
                                            <label>Degree Required :</label> {job.education_type.name} <br></br>
                                            <label>Experiance Required:</label> {job.years_experience_required} year(s) <br></br>
                                            <button onClick={routeChange("/create_application/" + job.id)}>Apply Now!</button>

                                        </li>
                                    </div>
                                </div>
                            ))
                        }
                        </ul>
                    </div>
                );
            }
            else {
                return <h1 className="text-center">We are sorry, we dont have any available jobs at this time</h1>
            }
        }
    
        return (
            <div className="row">
                <div className="col-md-3"></div>
                <div className="col-md-6">
                    { getAdvertisementsHTML() }
                </div>
            </div>
        );
    }

 //
    export default ViewAdvertisement;










    //-------------------------------------------------------------------------
/*
    const [request, setRequest] = useState({});


    useEffect(() => {
        getPendingCareTakerRequestById(getAuthToken(), id)
            .then(res => setRequest(res));
    }, []);


        var navigate = useNavigate()
        var { isLoaded, jobs } = this.state;
        if (!isLoaded) {
            return <div> Loading...</div>
        } else {
            return (
                <div>
                    <h1> Available Jobs</h1>
                    <ul>
                        {
                            
                        }
                    </ul>
                </div>
            )
        }
 }
export default ViewAdvertisement







/*
import React, { useEffect, useState } from "react";
import { getSecurityQuestionsForUser, getUser, lockAccount, login } from "../api/authRequests";
import { setAuthToken } from "../utils/storage";
import { isUserLoggedIn } from "../utils/storage";
import {getJobList} from "../api/jobApi.js";
import { useNavigate } from 'react-router-dom';

function ViewAdvertisement() {
    let navigate = useNavigate();
    console.log("start");

    //get jobs from database





    const getAllJobs = () => {
        
        /*
        useEffect(() => {
            //action that will happen in html
        }, ["dependencies"]);
        coment this out


        let jobs = [];


        return(
            <div>
             {jobs.map(job => <div name="job-container"> TEST
             </div> )}
            </div>
        )
        

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


*/