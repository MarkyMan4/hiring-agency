import React, { Component } from 'react'
import { getJobList } from "../api/jobApi.js";
import { useNavigate } from 'react-router-dom';
class ViewAdvertisement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            jobs: [],
            isLoaded: false
        }
    }
    render() {
        var { isLoaded, jobs } = this.state;
        if (!isLoaded) {
            return <div> Loading...</div>
        } else {
            return (
                <div>
                    <h1> Available Jobs</h1>
                    <ul>
                        {
                            jobs.map(job => (
                                <div class="row mt-4">
                                    <div class="col">
                                        <li key={job.id}>
                                            <h3>{job.service_type}</h3>
                                            <label>Description:</label> {job.description} <br></br>
                                            <label>Degree Required :</label> {job.education_type} <br></br>
                                            <label>Experiance Required:</label> {job.years_experience_required} year(s)
                                        </li>
                                    </div>
                                </div>
                            ))
                        }
                    </ul>
                </div>
            )
        }
    }

    componentDidMount() {
        getJobList().then(res => (this.setState({ jobs: res, isLoaded: true })));

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

export default ViewAdvertisement;
*/