import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { assignHpToServiceRequest } from "../api/serviceAssignments";
import { unassignHpToServiceRequest } from "../api/serviceAssignments";
import { retrieveHPByServiceAsisgnment } from "../api/serviceAssignments";
import { getHPList } from "../api/HPRequests";
import { retrieveServiceRequest } from "../api/serviceRequests";
import { getAllServiceRequests } from "../api/serviceRequests";
import { getAuthToken } from "../utils/storage";
import CancelButton from "../components/cancelButton";

const daySelectedStyle = {
    backgroundColor: 'rgb(5, 194, 68)',
    color: 'white'
};

function ServiceRequestDetail() {
    const { id } = useParams();
    const [serviceRequest, setServiceRequest] = useState({});
    const [hp, setHP] = useState();
    const [hpList, setHPList] = useState();
    const [servAssignList, setServAssignList] = useState();
    const [isAssigned, setIsAssigned] = useState();

    useEffect(() => {
        retrieveServiceRequest(getAuthToken(), id)
            .then(res => setServiceRequest(res));
    }, [id, isAssigned]);

    useEffect(() => {
        getHPList(getAuthToken())  //could be moved elsewhere for performance if needed
            .then(res => { setHPList(res); });

    }, []);

    useEffect(() => {
        getAllServiceRequests(getAuthToken(), true, false)  //could be moved elsewhere for performance if needed
            .then(res => { setServAssignList(res); });

    }, []);


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

    const assign = (event) => {
        event.preventDefault();
        assignHpToServiceRequest(getAuthToken(), id, event.target.value)
            .then(res => setIsAssigned(true))
            .catch(err => console.log(err.response.data));
    }

    const unassign = (event) =>{
        event.preventDefault();
        unassignHpToServiceRequest(getAuthToken(), hp.id)
            .then(res => setIsAssigned(false))
            .catch(err => console.log(err.response.data));
    }

    const getAvailableHP = () => { //also does validation
        let goodHPs = [];
        
        hpList.forEach(curHP => {
            //gender
            if (serviceRequest.hp_gender_required === true) {
                // console.log("comparing");
                // console.log(curHP.gender);
                // console.log(serviceRequest.patient_gender);
                // console.log(curHP.gender !== serviceRequest.patient_gender);
                if (curHP.gender !== serviceRequest.patient_gender) {
                    return; //TODO standardize male and female insead of M or F
                }
            }
            //age
            let parsedDate = curHP.date_of_birth.split("-");
            var dob = new Date(parsedDate[0], parseInt(parsedDate[1]) - 1, parsedDate[2]);  // prob will cause error 
            var month_diff = Date.now() - dob.getTime();
            var age_dt = new Date(month_diff);
            var year = age_dt.getUTCFullYear();
            //now calculate the age of the HP  
            var age = Math.abs(year - 1970);
            if (serviceRequest.hp_max_age !== null) {
                if (age > serviceRequest.hp_max_age) {
                    return;
                }
            }
            if (serviceRequest.hp_min_age !== null) {
                if (age < serviceRequest.hp_min_age) {
                    return;
                }
            }
            //schedule
            let hoursWorked = [0, 0, 0, 0, 0, 0, 0]; //a worker can work a max of 8 hours a day

            //load all hours worked by current assignments per day 
            servAssignList.forEach(thisServ => {//possibly a better way to do this
                if (thisServ.care_taker.id !== curHP.id) {
                    return;
                }

                if (thisServ.service_needed_sunday) {
                    if (thisServ.hours_of_service_daily === null) {
                        let t2 = thisServ.service_end_time.split(":");
                        let t1 = thisServ.service_start_time.split(":");
                        hoursWorked[0] += parseInt(t2[0]) - parseInt(t1[0]);
                    } else {
                        hoursWorked[0] += thisServ.hours_of_service_daily;
                    }
                }
                if (thisServ.service_needed_monday) {
                    if (thisServ.hours_of_service_daily === null) {
                        let t2 = thisServ.service_end_time.split(":");
                        let t1 = thisServ.service_start_time.split(":");
                        hoursWorked[1] += parseInt(t2[0]) - parseInt(t1[0]);
                    } else {
                        hoursWorked[1] += thisServ.hours_of_service_daily;
                    }
                }
                if (thisServ.service_needed_tuesday) {
                    if (thisServ.hours_of_service_daily === null) {
                        let t2 = thisServ.service_end_time.split(":");
                        let t1 = thisServ.service_start_time.split(":");
                        hoursWorked[2] += parseInt(t2[0]) - parseInt(t1[0]);
                    } else {
                        hoursWorked[2] += thisServ.hours_of_service_daily;
                    }
                }
                if (thisServ.service_needed_wednesday) {
                    if (thisServ.hours_of_service_daily === null) {
                        let t2 = thisServ.service_end_time.split(":");
                        let t1 = thisServ.service_start_time.split(":");
                        hoursWorked[3] += parseInt(t2[0]) - parseInt(t1[0]);
                    } else {
                        hoursWorked[3] += thisServ.hours_of_service_daily;
                    }
                }
                if (thisServ.service_needed_thursday) {
                    if (thisServ.hours_of_service_daily === null) {
                        let t2 = thisServ.service_end_time.split(":");
                        let t1 = thisServ.service_start_time.split(":");
                        hoursWorked[4] += parseInt(t2[0]) - parseInt(t1[0]);
                    } else {
                        hoursWorked[4] += thisServ.hours_of_service_daily;
                    }
                }
                if (thisServ.service_needed_friday) {
                    if (thisServ.hours_of_service_daily === null) {
                        let t2 = thisServ.service_end_time.split(":");
                        let t1 = thisServ.service_start_time.split(":");
                        hoursWorked[5] += parseInt(t2[0]) - parseInt(t1[0]);
                    } else {
                        hoursWorked[5] += thisServ.hours_of_service_daily;
                    }
                }
                if (thisServ.service_needed_saturday) {
                    if (thisServ.hours_of_service_daily === null) {
                        let t2 = thisServ.service_end_time.split(":");
                        let t1 = thisServ.service_start_time.split(":");
                        hoursWorked[6] += parseInt(t2[0]) - parseInt(t1[0]);
                    } else {
                        hoursWorked[6] += thisServ.hours_of_service_daily;
                    }
                }
            })
            // console.log("loaded existing schedules");
            // console.log(hoursWorked);
            //schedule - check if any conflicts with requested days/times 
            let timeRequested = 0;
            if (serviceRequest.hours_of_service_daily === undefined) {
                let t1 = serviceRequest.service_end_time.split(":");
                let t2 = serviceRequest.service_start_time.split(":");
                timeRequested = parseInt(t2[0]) - parseInt(t1[0]);
            } else {
                timeRequested = serviceRequest.hours_of_service_daily;
            }
            // console.log("time requested is ");
            // console.log(timeRequested);

            if (serviceRequest.service_needed_sunday) {
                if (timeRequested + hoursWorked[0] > 8) {
                    return;
                }
            }

            if (serviceRequest.service_needed_monday) {
                if (timeRequested + hoursWorked[1] > 8) {
                    return;
                }
            }

            if (serviceRequest.service_needed_tuesday) {
                if (timeRequested + hoursWorked[2] > 8) {
                    return;
                }
            }

            if (serviceRequest.service_needed_wednesday) {
                if (timeRequested + hoursWorked[3] > 8) {
                    return;
                }
            }

            if (serviceRequest.service_needed_thursday) {
                if (timeRequested + hoursWorked[4] > 8) {
                    return;
                }
            }

            if (serviceRequest.service_needed_friday) {
                if (timeRequested + hoursWorked[5] > 8) {
                    return;
                }
            }

            if (serviceRequest.service_needed_saturday) {
                if (timeRequested + hoursWorked[6] > 8) {
                    return;
                }
            }
            // console.log("we like this guys");
            goodHPs.push(curHP);
        })

        // console.log("made the hp avialable list here it is");
        // console.log(goodHPs);




        return (<div className="mb-5">
            {
                goodHPs.map(goodHP => {
            
                    return(
                        <div class="row mt-2" data-id="goodHP.id" >
                            <div class="col ">
                                <button type="button" className="service-request-hp-row btn btn-outline-secondary" value={goodHP.id} onClick={assign} >Name: {goodHP.user.first_name}  {goodHP.user.last_name}   |   Gender: {goodHP.gender}</button>
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

    const getAssignedHPorForm = () => {
        if (isDataLoaded() && serviceRequest.is_assigned === true && hp === undefined) {
            // console.log("http assigned hp");
            retrieveHPByServiceAsisgnment(getAuthToken(), serviceRequest.id)
                .then(res => {setHP(res);})
                .catch(err => console.log(err.response.data));
            return (<div></div>)

        } else if(isDataLoaded() && serviceRequest.is_assigned === true && hp !== undefined){
            // console.log("getting assigned hp data")
            return (
                <div>
                    {getHPHtml()}
                </div>
                )
        } else if (!isDataLoaded()) {
            // console.log("case notdataloaded");
            return;

        } else if (hpList !== undefined && servAssignList !== undefined) {
            // console.log("Case hp loaded");
            return (
                <div>
                    <h3>Assign a Health Care Professional to this Request from the list below</h3>
                    <h5>Available Health Care Professionals that meet the requirements</h5>
                    {getAvailableHP()}
                </div>
            )
        }
    }



    const getHPHtml = () => {
        return (
            <div className="row mt-4">
                <div className="col">
                    <div className="assigned-HP-servicecard shadow animate__animated animate__fadeInLeft">
                        <h3> Currently Assigned Healthcare Professional </h3>
                        <p> Name: {hp.healthcare_professional.user.first_name} {hp.healthcare_professional.user.last_name} </p>
                        <p> Gender: {hp.healthcare_professional.gender}</p>
                        <button type="button" className="btn btn-warning" onClick={unassign}> UnAssign</button>
                    </div>
                </div>
            </div>
        )
    }






    return (
        <div className="row animate__animated animate__fadeIn">
            <div className="col-md-6">
                <h1>Service request for a {isDataLoaded() ? serviceRequest.service_type.name.toLowerCase() : null}</h1>
            </div>
            <div className="col-md-6">
                <CancelButton returnUrl="/service_requests" style={{ float: 'right' }} />
            </div>
            <hr />
            {getHtmlOrNone()}
            <hr className="mt-5 mb-5" />

            {/* TODO: delete this, the hpId state and the assign function. using this as a placeholder so the billing account work can get started */}

            {getAssignedHPorForm()}


        </div>
    );
}

export default ServiceRequestDetail;
