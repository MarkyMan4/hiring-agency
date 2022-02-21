import React from "react";
import { useState } from "react";

function CreateServiceRequest() {
    const [patientFirstName, setPatientFirstName] = useState('');
    const [patientLastName, setPatientLastName] = useState('');
    const [patientGender, setPatientGender] = useState('M');
    const [patientDob, setPatientDob] = useState('');
    const [patientPhone, setPatientPhone] = useState();
    const [patientEmail, setPatientEmail] = useState('');
    const [serviceLocation, setServiceLocation] = useState('');
    const [flexibleHours, setFlexibleHours] = useState(false);
    const [serviceStartTime, setServiceStartTime] = useState('');
    const [serviceEndTime, setServiceEndTime] = useState('');
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

    const handleFormSubmit = (event) => {
        event.preventDefault();

        alert('submitted!')
    }

    const getHoursInput = () => {
        if(flexibleHours) {
            return (
                <div>
                    <label className="mt-3"><span className="text-danger">*</span>Hours of service daily</label>
                    <input 
                        required 
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
                    <input 
                        required 
                        type="time"
                        className="form-control mt-2" 
                        value = { serviceStartTime }
                        onChange={ event => setServiceStartTime(event.target.value) }
                    />

                    <label className="mt-3"><span className="text-danger">*</span>Service end time</label>
                    <input 
                        required 
                        type="time"
                        className="form-control mt-2" 
                        value = { serviceEndTime }
                        onChange={ event => setServiceEndTime(event.target.value) }
                    />
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
                <label><span className="text-danger">*</span>Patient first name</label>
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
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                </select>

                <label className="mt-3"><span className="text-danger">*</span>Patient date of birth</label>
                <input 
                    required 
                    className="form-control mt-2" 
                    type="date"
                    value = { patientDob }
                    onChange={ event => setPatientDob(event.target.value) }
                />

                <label className="mt-3"><span className="text-danger">*</span>Patient phone number</label>
                <input 
                    required 
                    type="tel"
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
                    value = { hpMinAge }
                    onChange={ event => setHpMinAge(event.target.value) }
                />

                <label className="mt-3">Health care professional maximum age (optional)</label>
                <input 
                    type="number"
                    className="form-control mt-2" 
                    value = { hpMaxAge }
                    onChange={ event => setHpMaxAge(event.target.value) }
                />

                <div className="text-danger mt-3">{ Object.keys(message).map((msg, indx) => <p key={ indx }>{ message[msg] }</p>) }</div>

                <button type="submit" className="btn btn-success mt-3">Submit</button>
            </form>
        </div>
    );
}

export default CreateServiceRequest;
