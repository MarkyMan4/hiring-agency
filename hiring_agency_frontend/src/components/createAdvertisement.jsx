import React, { useEffect, useState } from "react";
import { getSecurityQuestionsForUser, getUser, lockAccount, login } from "../api/authRequests";
import { setAuthToken } from "../utils/storage";
import { isUserLoggedIn } from "../utils/storage";
import { useNavigate } from 'react-router-dom';

function createAdvertisement() {
    let navigate = useNavigate();

    const validateJobPost = () => {
        //check input

        //if correct send data

    }

    

    return (
        <div className="row w-100 mt-5">
            <div className="col-md-4"></div>
            <div className="col-md-4 text-center login-form shadow">
                <form id="newjobpostform">
                    <Label>Job Type</Label>
                    <select id="jobtype" form="newjobpostform" required>
                        <option value="Nurse">Nurse</option>
                        <option value="Physiotherapist">Physiotherapist</option>
                    </select>
                    <Label>Education Requirements</Label>
                    <input type="text" name="education" required></input>
                    <Label>Experiance Required</Label>
                    <input type="text" name="experiance" required></input>
                    <Label>Description</Label>
                    <input type="text" name="description" required></input>
                    <button onSubmit={validateJobPost}>Submit</button>
                </form>
            </div>
        </div>
    )
}

export default createAdvertisement;
