import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getHPList } from "../api/HPRequests";
import { getAssignedTimes, retrieveServiceRequest } from "../api/serviceRequests";
import { getAuthToken } from "../utils/storage";
import CancelButton from "../components/cancelButton";
import ServAssignModal from "../components/servAssignModal";
import { Chart } from "react-google-charts";
import { getAssignmentsForRequest } from "../api/serviceAssignments";

const daySelectedStyle = {
    backgroundColor: 'rgb(5, 194, 68)',
    color: 'white'
};

function ServiceRequestDetail() {
    const { id } = useParams();
    const [serviceRequest, setServiceRequest] = useState({});
    const [hpList, setHPList] = useState();
    const [assignedTimes, setAssignedTimes] = useState([]);
    const [assignedCallback, setAssignedCallback] = useState(false); // this is just a trigger for reloading the schedule
    const [serviceAssignments, setServiceAssignments] = useState([]);

    useEffect(() => {
        retrieveServiceRequest(getAuthToken(), id)
            .then(res => setServiceRequest(res));
    }, [id]);

    useEffect(() => {
        getHPList(getAuthToken(), serviceRequest?.id)
            .then(res => setHPList(res));
    }, [serviceRequest]);

    useEffect(() => {
        let times = [
            [
                { type: "string", id: "Day" },
                { type: "string", id: "Name" },
                { type: "date", id: "Start" },
                { type: "date", id: "End" },
            ]
        ];

        // get time blocks of people assigned to this request
        getAssignedTimes(getAuthToken(), id)
            .then(res => {
                res.forEach(time => {
                    times.push(
                        [
                            time.day,
                            time.name,
                            Date.parse(`1-1-1 ${time.start_time}`),
                            Date.parse(`1-1-1 ${time.end_time}`)
                        ]
                    )
                });

                setAssignedTimes(times);
            });

        // get list of healthcare professionals assigned to this request
        getAssignmentsForRequest(getAuthToken(), id)
            .then(res => { setServiceAssignments(res); console.log(res); });

    }, [assignedCallback]);

    const isDataLoaded = () => {
        return Object.keys(serviceRequest).length > 0;
    }

    // if flexible hours, we only show the hours needed per day, else show start and end time of service
    const getHoursOrTimes = () => {
        let html;

        if (serviceRequest.flexible_hours) {
            html = (
                <div>
                    <b>Hours of service</b>
                    <p>{serviceRequest.hours_of_service_daily}</p>
                </div>
            );
        }
        else {
            html = (
                <div>
                    <b>Start time</b>
                    <p>{serviceRequest.service_start_time}</p>
                    <b>End time</b>
                    <p>{serviceRequest.service_end_time}</p>
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

        if (serviceRequest.hp_gender_required) {
            hpGender = (
                <div>
                    <b>Healthcare professional gender</b>
                    <p>{serviceRequest.patient_gender}</p>
                </div>
            );
        }

        if (serviceRequest.hp_min_age) {
            hpMinAge = (
                <div>
                    <b>Healthcare professional min age</b>
                    <p>{serviceRequest.hp_min_age}</p>
                </div>
            );
        }

        if (serviceRequest.hp_max_age) {
            hpMaxAge = (
                <div>
                    <b>Healthcare professional max age</b>
                    <p>{serviceRequest.hp_max_age}</p>
                </div>
            );
        }

        return (
            <div>
                {hpGender}
                {hpMinAge}
                {hpMaxAge}
            </div>
        );
    }

    const getAvailableHP = () => {
        return (<div className="mb-5">
            {
                hpList?.map(goodHP => {            
                    return(
                        <div class="row mt-2" key={ goodHP.id } >
                            <div class="col ">
                                <ServAssignModal 
                                    buttonText={ `Name: ${goodHP.user.first_name}  ${goodHP.user.last_name}   |   Gender: ${goodHP.gender}` }
                                    healthProId={ goodHP.id }
                                    serviceRequest={ serviceRequest }
                                    assignedCallback={ () => setAssignedCallback(!assignedCallback) }
                                />
                            </div>
                        </div>
                    )
                })
            }
        </div>);
    }

    const getHtmlOrNone = () => {
        if (isDataLoaded()) {
            return (
                <div className="row mt-4">
                    <div className="col-md-4 mb-3">
                        <div className="service-detail-card shadow animate__animated animate__fadeInLeft">
                            <h3 className="mt-4">Care taker info</h3>
                            <hr />
                            <b>Name</b>
                            <p>{serviceRequest.care_taker.user.first_name} {serviceRequest.care_taker.user.last_name}</p>
                            <b>Email</b>
                            <p>{serviceRequest.care_taker.email}</p>
                            <b>Phone number</b>
                            <p>{serviceRequest.care_taker.phone_number}</p>
                        </div>
                    </div>

                    <div className="col-md-4 mb-3">
                        <div className="service-detail-card shadow animate__animated animate__zoomIn">
                            <h3 className="mt-4">Patient info</h3>
                            <hr />
                            <b>Name</b>
                            <p>{serviceRequest.patient_first_name} {serviceRequest.patient_last_name}</p>
                            <b>Gender</b>
                            <p>{serviceRequest.patient_gender}</p>
                            <b>Date of birth</b>
                            <p>{serviceRequest.patient_date_of_birth}</p>
                            <b>Email</b>
                            <p>{serviceRequest.patient_email}</p>
                            <b>Phone number</b>
                            <p>{serviceRequest.patient_phone_number}</p>
                        </div>
                    </div>

                    <div className="col-md-4 mb-3">
                        <div className="service-detail-card shadow animate__animated animate__fadeInRight">
                            <h3 className="mt-4">Request info</h3>
                            <hr />
                            <b>Service type</b>
                            <p>{serviceRequest.service_type.name}</p>
                            <b>Service location</b>
                            <p>{serviceRequest.service_location}</p>
                            <b>Start date</b>
                            <p>{serviceRequest.start_date}</p>
                            {getHoursOrTimes()}
                            <b>Days service needed</b>
                            <div className="mt-2 mb-3">
                                <span className="day-of-week-box" style={serviceRequest.service_needed_sunday ? daySelectedStyle : {}}>Sun</span>
                                <span className="day-of-week-box" style={serviceRequest.service_needed_monday ? daySelectedStyle : {}}>Mon</span>
                                <span className="day-of-week-box" style={serviceRequest.service_needed_tuesday ? daySelectedStyle : {}}>Tue</span>
                                <span className="day-of-week-box" style={serviceRequest.service_needed_wednesday ? daySelectedStyle : {}}>Wed</span>
                                <span className="day-of-week-box" style={serviceRequest.service_needed_thursday ? daySelectedStyle : {}}>Thu</span>
                                <span className="day-of-week-box" style={serviceRequest.service_needed_friday ? daySelectedStyle : {}}>Fri</span>
                                <span className="day-of-week-box" style={serviceRequest.service_needed_saturday ? daySelectedStyle : {}}>Sat</span>
                            </div>
                            <b>Total days of service</b>
                            <p>{serviceRequest.days_of_service}</p>
                            {getSpecialRequests()}
                        </div>
                    </div>
                </div>
            );
        }
        else {
            return null;
        }
    }

    const getAssignedOrNull = () => {
        if(assignedTimes.length > 1) {
            return (
                <div>
                    <h3>Current assignments</h3>
                    <div>
                        <Chart
                            chartType="Timeline"
                            data={assignedTimes}
                            options={{height: 300}}
                        />
                    </div>
                    <table className="table table-striped mb-5">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Day of week</th>
                                <th>Start time</th>
                                <th>End time</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            { serviceAssignments.map(sa => {
                                return (
                                    <tr>
                                        <td>{sa.healthcare_professional.user.first_name} {sa.healthcare_professional.user.last_name}</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                );
                            }) }
                        </tbody>
                    </table>
                    <hr />
                </div>
            );
        }
    }

    return (
        <div className="animate__animated animate__fadeIn">
            <div className="row">
                <div className="col-md-6">
                    <h1>Service request for a {isDataLoaded() ? serviceRequest.service_type.name.toLowerCase() : null}</h1>
                </div>
                <div className="col-md-6">
                    <CancelButton returnUrl="/service_requests" style={{ float: 'right' }} />
                </div>
                <hr />
                {getHtmlOrNone()}
            </div>
            <hr className="mt-5 mb-5" />

            { getAssignedOrNull() }

            <div>
                <h3>Assign a Health Care Professional to this Request from the list below</h3>
                <h5>Available Health Care Professionals that meet the requirements</h5>
                { getAvailableHP() }
            </div>
        </div>
    );
}

export default ServiceRequestDetail;
