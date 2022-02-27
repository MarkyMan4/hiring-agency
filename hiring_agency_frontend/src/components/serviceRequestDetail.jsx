import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { retrieveServiceRequest } from "../api/serviceRequests";
import { getAuthToken } from "../utils/storage";
import CancelButton from "./cancelButton";

function ServiceRequestDetail() {
    const { id } = useParams();
    const [serviceRequest, setServiceRequest] = useState({});
    const [hpId, setHpId] = useState(); // TEMPORARY - USED TO QUICKLY ASSIGN HP TO SERVICE REQUESTS

    useEffect(() => {
        retrieveServiceRequest(getAuthToken(), id)
            .then(res => setServiceRequest(res));
    }, []);

    const isDataLoaded = () => {
        return Object.keys(serviceRequest).length > 0;
    }

    // if flexible hours, we only show the hours needed per day, else show start and end time of service
    const getHoursOrTimes = () => {
        let html;

        if(serviceRequest.flexible_hours) {
            html = (
                <div>
                    <b>Hours of service</b>
                    <p>{ serviceRequest.hours_of_service_daily }</p>
                </div>
            );
        }
        else {
            html = (
                <div>
                    <b>Start time</b>
                    <p>{ serviceRequest.service_start_time }</p>
                    <b>End time</b>
                    <p>{ serviceRequest.service_end_time }</p>
                </div>
            );
        }

        return html;
    }

    // things like HP gender, HP min/max age are optional requests, so only show them if they were specified
    const getSpecialRequests = () => {
        let hpGender = null;
        let hpMinAge = null;
        let hpMaxAge = null;

        if(serviceRequest.hp_gender_required) {
            hpGender = (
                <div>
                    <b>Healthcare professional gender</b>
                    <p>{ serviceRequest.patient_gender }</p>
                </div>
            );
        }

        if(serviceRequest.hp_min_age) {
            hpMinAge = (
                <div>
                    <b>Healthcare professional min age</b>
                    <p>{ serviceRequest.hp_min_age }</p>
                </div>
            );
        }

        if(serviceRequest.hp_max_age) {
            hpMaxAge = (
                <div>
                    <b>Healthcare professional max age</b>
                    <p>{ serviceRequest.hp_max_age }</p>
                </div>
            );
        }

        return (
            <div>
                { hpGender }
                { hpMinAge }
                { hpMaxAge }
            </div>
        );
    }

    // DELETE ME!!!!!
    const assign = (event) => {
        event.preventDefault();

        alert('assigned');
    }

    const getHtmlOrNone = () => {
        if(isDataLoaded()) {
            return (
                <div className="row mt-4">
                    <div className="col-md-4 mb-3">
                        <div className="service-detail-card shadow">
                            <h3 className="mt-4">Care taker info</h3>
                            <hr />
                            <b>Name</b>
                            <p>{ serviceRequest.care_taker.user.first_name } { serviceRequest.care_taker.user.last_name }</p>
                            <b>Email</b>
                            <p>{ serviceRequest.care_taker.email }</p>
                            <b>Phone number</b>
                            <p>{ serviceRequest.care_taker.phone_number }</p>
                        </div>
                    </div>

                    <div className="col-md-4 mb-3">
                        <div className="service-detail-card shadow">
                            <h3 className="mt-4">Patient info</h3>
                            <hr />
                            <b>Name</b>
                            <p>{ serviceRequest.patient_first_name } { serviceRequest.patient_last_name }</p>
                            <b>Gender</b>
                            <p>{ serviceRequest.patient_gender }</p>
                            <b>Date of birth</b>
                            <p>{ serviceRequest.patient_date_of_birth }</p>
                            <b>Email</b>
                            <p>{ serviceRequest.patient_email }</p>
                            <b>Phone number</b>
                            <p>{ serviceRequest.patient_phone_number }</p>
                        </div>
                    </div>

                    <div className="col-md-4 mb-3">
                        <div className="service-detail-card shadow">
                            <h3 className="mt-4">Request info</h3>
                            <hr />
                            <b>Service type</b>
                            <p>{ serviceRequest.service_type.name }</p>
                            { getHoursOrTimes() }
                            <b>Service location</b>
                            <p>{ serviceRequest.service_location }</p>
                            <b>Days of service</b>
                            <p>{ serviceRequest.days_of_service }</p>
                            { getSpecialRequests() }
                        </div>
                    </div>
                </div>
            );
        }
        else {
            return null;
        }
    }

    return (
        <div className="row">
            <div className="col-md-6">
                <h1>Service request for a { isDataLoaded() ? serviceRequest.service_type.name.toLowerCase() : null }</h1>
            </div>
            <div className="col-md-6">
                <CancelButton returnUrl="/service_requests" style={ {float: 'right'} } />
            </div>
            <hr />
            { getHtmlOrNone() }
            <hr className="mt-5 mb-5" />

            {/* TODO: delete this and the hpId state, using this as a placeholder so the billing account work can get started */}
            <h5>see comment in serviceRequestDetail.jsx line 158</h5>
            <form onSubmit={ assign }>
                <label>health care professional id</label>
                <input onChange={ (event) => setHpId(event.target.value) } required></input>

                <button type="submit">assign</button>
            </form>
        </div>
    );
}

export default ServiceRequestDetail;
