import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { requestNewService } from "../api/serviceRequests";
import { getServiceTypes } from "../api/staticDataRequests";
import { getAuthToken } from "../utils/storage";


const getCurrentDateStr = () => {
    const today = new Date();
    const year = today.getFullYear().toString();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
}

function CreateServiceRequest({ roles }) {
    const navigate = useNavigate();
    const [careTakerUsername, setCareTakerUsername] = useState();
    const [patientFirstName, setPatientFirstName] = useState('');
    const [patientLastName, setPatientLastName] = useState('');
    const [patientGender, setPatientGender] = useState('Male');
    const [patientDob, setPatientDob] = useState('');
    const [patientPhone, setPatientPhone] = useState();
    const [patientEmail, setPatientEmail] = useState('');
    const [serviceLocation, setServiceLocation] = useState('');
    const [startDate, setStartDate] = useState();
    const [flexibleHours, setFlexibleHours] = useState(false);
    const [serviceStartTime, setServiceStartTime] = useState();
    const [serviceEndTime, setServiceEndTime] = useState();
    const [hoursOfService, setHoursOfService] = useState();
    const [serviceType, setServiceType] = useState(1);
    const [serviceSunday, setServiceSunday] = useState(false);
    const [serviceMonday, setServiceMonday] = useState(false);
    const [serviceTuesday, setServiceTuesday] = useState(false);
    const [serviceWednesday, setServiceWednesday] = useState(false);
    const [serviceThursday, setServiceThursday] = useState(false);
    const [serviceFriday, setServiceFriday] = useState(false);
    const [serviceSaturday, setServiceSaturday] = useState(false);
    const [daysOfService, setDaysOfService] = useState();
    const [hpGenderRequired, setHpGenderRequired] = useState(false);
    const [hpMinAge, setHpMinAge] = useState();
    const [hpMaxAge, setHpMaxAge] = useState();
    const [message, setMessage] = useState('');

    const [serviceTypeInfo, setServiceTypeInfo] = useState({});
    const [serviceTimeOptions, setServiceTimeOptions] = useState([]);

    useEffect(() => {
        // retrieve service types
        getServiceTypes()
            .then(res => {
                // format the data so it's easier to lookup service types
                // each key is the service type ID and the value is the details as an object
                let info = {};

                res.forEach(r => {
                    info[r.id] = r;
                });

                setServiceTypeInfo(info);
            });
    }, []);

    // filter service time options whenever a service type is selected
    useEffect(() => {
        // create all times in 30 minute increments
        let timeOptions = [];

        for(let i = 0; i < 24; i++) {
            let hour = i.toString().padStart(2, '0');
            timeOptions.push(
                {
                    twentyFourHourTime: `${ hour }:00`,
                    twelveHourTime: `${ i > 12 ? i - 12 : i }:00 ${ i >= 12 ? 'PM' : 'AM' }`
                }
            );

            timeOptions.push(
                {
                    twentyFourHourTime: `${ hour }:30`,
                    twelveHourTime: `${ i > 12 ? i - 12 : i }:30 ${ i >= 12 ? 'PM' : 'AM' }`
                }
            );
        }

        if(Object.keys(serviceTypeInfo).length > 0) {
            timeOptions = timeOptions.filter(o => {
                return (
                    o.twentyFourHourTime >= removeMicroSecondsFromTime(serviceTypeInfo[serviceType]?.earliest_work_time)
                    && o.twentyFourHourTime <= removeMicroSecondsFromTime(serviceTypeInfo[serviceType]?.latest_work_time)
                );
            });
        }

        setServiceTimeOptions(timeOptions);

        // update selected times
        setServiceStartTime(timeOptions[0].twentyFourHourTime);
        setServiceEndTime(timeOptions[0].twentyFourHourTime);
    }, [serviceType, serviceTypeInfo]);

    const removeMicroSecondsFromTime = (timeStr) => {
        let timeParts = timeStr.split(':');

        return `${timeParts[0]}:${timeParts[1]}`;
    }

    const handleFormSubmit = (event) => {
        event.preventDefault();

        // if no days of service are selected, make them pick one
        if(!(serviceSunday || serviceMonday || serviceTuesday || serviceWednesday || serviceThursday || serviceFriday || serviceSaturday)) {
            setMessage({error: 'You must pick at least one day of service'});
            console.log("1Care taker user name is " + careTakerUsername);
        }
        else {
            console.log("2Care taker user name is " + careTakerUsername);
            requestNewService(
                getAuthToken(),
                careTakerUsername,
                patientFirstName,
                patientLastName,
                patientGender,
                patientDob,
                patientPhone,
                patientEmail,
                serviceLocation,
                startDate,
                flexibleHours,
                flexibleHours ? null : serviceStartTime, // if flexible hours were selected, start and end time should be null
                flexibleHours ? null : serviceEndTime,
                flexibleHours ? hoursOfService : null,
                serviceType,
                serviceSunday,
                serviceMonday,
                serviceTuesday,
                serviceWednesday,
                serviceThursday,
                serviceFriday,
                serviceSaturday,
                daysOfService,
                hpGenderRequired,
                hpMinAge,
                hpMaxAge
            )
            .then(res => navigate('/create_service_request_success'))
            .catch(err => setMessage(err.response.data));
        }
    }

    const getHoursInput = () => {
        if(flexibleHours) {
            return (
                <div>
                    <label className="mt-3"><span className="text-danger">*</span>Hours of service daily</label>
                    <input 
                        required 
                        type="number"
                        className="form-control mt-2" 
                        value = { hoursOfService }
                        onChange={ event => setHoursOfService(event.target.value) }
                    />
                </div>
            );
        }
        else {
            return (
                <div>
                    <label className="mt-3"><span className="text-danger">*</span>Service start time</label>
                    <select value={ serviceStartTime } onChange={ event => setServiceStartTime(event.target.value) } className="form-select">
                        { serviceTimeOptions.map((time, indx) => <option value={ time.twentyFourHourTime } key={ indx }>{ time.twelveHourTime }</option>) }
                    </select>

                    <label className="mt-3"><span className="text-danger">*</span>Service end time</label>
                    <select value={ serviceEndTime } onChange={ event => setServiceEndTime(event.target.value) } className="form-select">
                        { serviceTimeOptions.map((time, indx) => <option value={ time.twentyFourHourTime } key={ indx }>{ time.twelveHourTime }</option>) }
                    </select>
                </div>
            );
        }
    }

    return (
        <div className="mb-5">
            <h1>New service request</h1>
            <p>
                To request service for your patient, please fill out the form below.
            </p>
            <hr />
            <form onSubmit={ handleFormSubmit } className="basic-form">
                {/* only admin is required to enter the username of the care taker */}
                { roles.includes('admin') ?
                    <div>
                        <label><span className="text-danger">*</span>Care taker username</label>
                        <input 
                            required 
                            className="form-control mt-2" 
                            value = { careTakerUsername }
                            onChange={ event => setCareTakerUsername(event.target.value) }
                        />
                    </div>
                    : <div></div>
                }

                <label className="mt-3"><span className="text-danger">*</span>Patient first name</label>
                <input 
                    required 
                    className="form-control mt-2" 
                    value = { patientFirstName }
                    onChange={ event => setPatientFirstName(event.target.value) }
                />

                <label className="mt-3"><span className="text-danger">*</span>Patient last name</label>
                <input 
                    required 
                    className="form-control mt-2" 
                    value = { patientLastName }
                    onChange={ event => setPatientLastName(event.target.value) }
                />

                <label className="mt-3"><span className="text-danger">*</span>Patient gender</label>
                <select value={ patientGender } onChange={ event => setPatientGender(event.target.value) } className="form-select">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>

                <label className="mt-3"><span className="text-danger">*</span>Patient date of birth</label>
                <input 
                    required 
                    className="form-control mt-2" 
                    type="date"
                    max={ getCurrentDateStr() }
                    value = { patientDob }
                    onChange={ event => setPatientDob(event.target.value) }
                />

                <label className="mt-3"><span className="text-danger">*</span>Patient phone number</label>
                <input 
                    required 
                    type="tel"
                    maxLength={10} 
                    minLength={10}
                    placeholder="only enter digits, e.g. 1234567890"
                    className="form-control mt-2" 
                    value = { patientPhone }
                    onChange={ event => setPatientPhone(event.target.value) }
                />

                <label className="mt-3"><span className="text-danger">*</span>Patient email</label>
                <input 
                    required 
                    className="form-control mt-2" 
                    value = { patientEmail }
                    onChange={ event => setPatientEmail(event.target.value) }
                />

                <label className="mt-3"><span className="text-danger">*</span>Service location</label>
                <input 
                    required 
                    className="form-control mt-2" 
                    value = { serviceLocation }
                    onChange={ event => setServiceLocation(event.target.value) }
                />

                <label className="mt-3"><span className="text-danger">*</span>Start date</label>
                <input 
                    required 
                    type="date"
                    min={ getCurrentDateStr() }
                    className="form-control mt-2" 
                    value = { startDate }
                    onChange={ event => setStartDate(event.target.value) }
                />

                <label className="mt-3">Flexible hours?</label><br />
                <input 
                    type="checkbox"
                    className="form-check-input mt-2" 
                    checked={ flexibleHours }
                    onChange={ event => setFlexibleHours(!flexibleHours) }
                />

                { getHoursInput() }

                <label className="mt-3"><span className="text-danger">*</span>Service type</label><br />
                <select value={ serviceType } onChange={ event => setServiceType(event.target.value) } className="form-select">
                    <option value="1">Nurse</option>
                    <option value="2">Physiotherapist</option>
                    <option value="3">Psychiatrists</option>
                </select>

                <label className="mt-3"><span className="text-danger">*</span>Select days service needed:</label><br />
                <div className="row">
                    <div className="col-md-3">
                        <label>Sunday</label><br />
                        <label>Monday</label><br />
                        <label>Tuesday</label><br />
                        <label>Wednesday</label><br />
                        <label>Thursday</label><br />
                        <label>Friday</label><br />
                        <label>Saturday</label><br />
                    </div>
                    
                    <div className="col-md-1">
                        <input 
                            type="checkbox"
                            className="form-check-input" 
                            checked={ serviceSunday }
                            onChange={ event => setServiceSunday(!serviceSunday) }
                        />
                        <br />
                        <input 
                            type="checkbox"
                            className="form-check-input" 
                            checked={ serviceMonday }
                            onChange={ event => setServiceMonday(!serviceMonday) }
                        />
                        <br />
                        <input 
                            type="checkbox"
                            className="form-check-input" 
                            checked={ serviceTuesday }
                            onChange={ event => setServiceTuesday(!serviceTuesday) }
                        />
                        <br />
                        <input 
                            type="checkbox"
                            className="form-check-input" 
                            checked={ serviceWednesday }
                            onChange={ event => setServiceWednesday(!serviceWednesday) }
                        />
                        <br />
                        <input 
                            type="checkbox"
                            className="form-check-input" 
                            checked={ serviceThursday }
                            onChange={ event => setServiceThursday(!serviceThursday) }
                        />
                        <br />
                        <input 
                            type="checkbox"
                            className="form-check-input" 
                            checked={ serviceFriday }
                            onChange={ event => setServiceFriday(!serviceFriday) }
                        />
                        <br />
                        <input 
                            type="checkbox"
                            className="form-check-input" 
                            checked={ serviceSaturday }
                            onChange={ event => setServiceSaturday(!serviceSaturday) }
                        />
                    </div>
                </div>

                <label className="mt-3"><span className="text-danger">*</span>Total days of service</label>
                <input 
                    required 
                    type="number"
                    min={1}
                    className="form-control mt-2" 
                    value = { daysOfService }
                    onChange={ event => setDaysOfService(event.target.value) }
                />

                <label className="mt-3">Require health care professional to have same gender as patient? (optional)</label><br />
                <input 
                    type="checkbox"
                    className="form-check-input mt-2" 
                    checked={ hpGenderRequired }
                    onChange={ event => setHpGenderRequired(!hpGenderRequired) }
                />
                <br />

                <label className="mt-3">Health care professional minimum age (optional)</label>
                <input 
                    type="number"
                    className="form-control mt-2" 
                    min={18}
                    value = { hpMinAge }
                    onChange={ event => setHpMinAge(event.target.value) }
                />

                <label className="mt-3">Health care professional maximum age (optional)</label>
                <input 
                    type="number"
                    className="form-control mt-2" 
                    min={ hpMinAge }
                    value = { hpMaxAge }
                    onChange={ event => setHpMaxAge(event.target.value) }
                />

                <div className="text-danger mt-3">{ Object.keys(message).map((msg, indx) => <p key={ indx }><b>{ msg.replaceAll('_', ' ') }</b>: { message[msg] }</p>) }</div>

                <button type="submit" className="btn btn-success mt-3">Submit</button>
            </form>
        </div>
    );
}

export default CreateServiceRequest;
