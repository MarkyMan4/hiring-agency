import React, { useEffect, useState } from "react";
import { getHpSchedule } from "../api/HPRequests";
import { getAuthToken } from "../utils/storage";
import TimeSlotPicker from "./timeSlotPicker";
import { assignHpToServiceRequest } from "../api/serviceAssignments";

function ServAssignModal({ buttonText, healthProId, serviceRequest, assignedCallback }) {
    const [display, setDisplay] = useState('none');
    const [schedule, setSchedule] = useState({});
    const [serviceStartDate, setServiceStartDate] = useState();
    const [serviceEndDate, setServiceEndDate] = useState();

    const [startTimeSunday, setStartTimeSunday] = useState(null);
    const [endTimeSunday, setEndTimeSunday] = useState(null);
    const [startTimeMonday, setStartTimeMonday] = useState(null);
    const [endTimeMonday, setEndTimeMonday] = useState(null);
    const [startTimeTuesday, setStartTimeTuesday] = useState(null);
    const [endTimeTuesday, setEndTimeTuesday] = useState(null);
    const [startTimeWednesday, setStartTimeWednesday] = useState(null);
    const [endTimeWednesday, setEndTimeWednesday] = useState(null);
    const [startTimeThursday, setStartTimeThursday] = useState(null);
    const [endTimeThursday, setEndTimeThursday] = useState(null);
    const [startTimeFriday, setStartTimeFriday] = useState(null);
    const [endTimeFriday, setEndTimeFriday] = useState(null);
    const [startTimeSaturday, setStartTimeSaturday] = useState(null);
    const [endTimeSaturday, setEndTimeSaturday] = useState(null);

    const [conflictSunday, setConflictSunday] = useState(false);
    const [conflictMonday, setConflictMonday] = useState(false);
    const [conflictTuesday, setConflictTuesday] = useState(false);
    const [conflictWednesday, setConflictWednesday] = useState(false);
    const [conflictThursday, setConflictThursday] = useState(false);
    const [conflictFriday, setConflictFriday] = useState(false);
    const [conflictSaturday, setConflictSaturday] = useState(false);
    const [errorMsg, setErrorMsg] = useState();

    useEffect(() => {
        getHpSchedule(getAuthToken(), healthProId)
            .then(res => setSchedule(res));
    }, [display]);

    useEffect(() => {
        if(Object.keys(serviceRequest).length > 0) {
            let daysServiceNeeded = {
                0: serviceRequest.service_needed_sunday,
                1: serviceRequest.service_needed_monday,
                2: serviceRequest.service_needed_tuesday,
                3: serviceRequest.service_needed_wednesday,
                4: serviceRequest.service_needed_thursday,
                5: serviceRequest.service_needed_friday,
                6: serviceRequest.service_needed_saturday
            };

            let daysOfService = serviceRequest.days_of_service;
            let dateParts = serviceRequest.start_date.split('-');

            let year = parseInt(dateParts[0]);
            let month = parseInt(dateParts[1]) - 1;
            let dayOfMonth = parseInt(dateParts[2]);
            let startDate = new Date(year, month, dayOfMonth);

            setServiceStartDate(startDate);

            let date = new Date(year, month, dayOfMonth);

            while(daysOfService >= 0) {
                if(daysServiceNeeded[date.getDay()]) {
                    daysOfService -= 1;
                }

                if(daysOfService > 0) {
                    date.setDate(date.getDate() + 1);
                }
            }

            setServiceEndDate(date);
        }

    }, [serviceRequest]);

    let modalDisplay = {
        display: display
    }

    const toggleModal = () => {
        // reset variables
        setStartTimeSunday(null);
        setEndTimeSunday(null);
        setStartTimeMonday(null);
        setEndTimeMonday(null);
        setStartTimeTuesday(null);
        setEndTimeTuesday(null);
        setStartTimeWednesday(null);
        setEndTimeWednesday(null);
        setStartTimeThursday(null);
        setEndTimeThursday(null);
        setStartTimeFriday(null);
        setEndTimeFriday(null);
        setStartTimeSaturday(null);
        setEndTimeSaturday(null);
        setConflictSunday(false);
        setConflictMonday(false);
        setConflictTuesday(false);
        setConflictWednesday(false);
        setConflictThursday(false);
        setConflictFriday(false);
        setConflictSaturday(false);
        setErrorMsg(null);
        
        if(display === 'none')
            setDisplay('flex');
        else
            setDisplay('none');
    }

    const getTimeSlotForm = () => {
        let timeSunday = null;
        let timeMonday = null;
        let timeTuesday = null;
        let timeWednesday = null;
        let timeThursday = null;
        let timeFriday = null;
        let timeSaturday = null;

        if(serviceRequest.service_needed_sunday) {
            timeSunday = (
                <TimeSlotPicker 
                    day={ 0 }
                    schedule={ schedule }
                    serviceStartDate={ serviceStartDate }
                    serviceEndDate={ serviceEndDate }
                    startTimeCallback={ startTime => setStartTimeSunday(startTime === '--select--' ? null : startTime) }
                    endTimeCallback={ endTime => setEndTimeSunday(endTime === '--select--' ? null : endTime) }
                    conflictCallback={ hasConflict => setConflictSunday(hasConflict) }
                />
            );
        }

        if(serviceRequest.service_needed_monday) {
            timeMonday = (
                <TimeSlotPicker 
                    day={ 1 }
                    schedule={ schedule }
                    serviceStartDate={ serviceStartDate }
                    serviceEndDate={ serviceEndDate }
                    startTimeCallback={ startTime => setStartTimeMonday(startTime === '--select--' ? null : startTime) }
                    endTimeCallback={ endTime => setEndTimeMonday(endTime === '--select--' ? null : endTime) }
                    conflictCallback={ hasConflict => setConflictMonday(hasConflict) }
                />
            );
        }

        if(serviceRequest.service_needed_tuesday) {
            timeTuesday = (
                <TimeSlotPicker 
                    day={ 2 }
                    schedule={ schedule }
                    serviceStartDate={ serviceStartDate }
                    serviceEndDate={ serviceEndDate }
                    startTimeCallback={ startTime => setStartTimeTuesday(startTime === '--select--' ? null : startTime) }
                    endTimeCallback={ endTime => setEndTimeTuesday(endTime === '--select--' ? null : endTime) }
                    conflictCallback={ hasConflict => setConflictTuesday(hasConflict) }
                />
            );
        }

        if(serviceRequest.service_needed_wednesday) {
            timeWednesday = (
                <TimeSlotPicker 
                    day={ 3 }
                    schedule={ schedule }
                    serviceStartDate={ serviceStartDate }
                    serviceEndDate={ serviceEndDate }
                    startTimeCallback={ startTime => setStartTimeWednesday(startTime === '--select--' ? null : startTime) }
                    endTimeCallback={ endTime => setEndTimeWednesday(endTime === '--select--' ? null : endTime) }
                    conflictCallback={ hasConflict => setConflictWednesday(hasConflict) }
                />
            );
        }

        if(serviceRequest.service_needed_thursday) {
            timeThursday = (
                <TimeSlotPicker 
                    day={ 4 }
                    schedule={ schedule }
                    serviceStartDate={ serviceStartDate }
                    serviceEndDate={ serviceEndDate }
                    startTimeCallback={ startTime => setStartTimeThursday(startTime === '--select--' ? null : startTime) }
                    endTimeCallback={ endTime => setEndTimeThursday(endTime === '--select--' ? null : endTime) }
                    conflictCallback={ hasConflict => setConflictThursday(hasConflict) }
                />
            );
        }

        if(serviceRequest.service_needed_friday) {
            timeFriday = (
                <TimeSlotPicker 
                    day={ 5 }
                    schedule={ schedule }
                    serviceStartDate={ serviceStartDate }
                    serviceEndDate={ serviceEndDate }
                    startTimeCallback={ startTime => setStartTimeFriday(startTime === '--select--' ? null : startTime) }
                    endTimeCallback={ endTime => setEndTimeFriday(endTime === '--select--' ? null : endTime) }
                    conflictCallback={ hasConflict => setConflictFriday(hasConflict) }
                />
            );
        }

        if(serviceRequest.service_needed_saturday) {
            timeSaturday = (
                <TimeSlotPicker 
                    day={ 6 }
                    schedule={ schedule }
                    serviceStartDate={ serviceStartDate }
                    serviceEndDate={ serviceEndDate }
                    startTimeCallback={ startTime => setStartTimeSaturday(startTime === '--select--' ? null : startTime) }
                    endTimeCallback={ endTime => setEndTimeSaturday(endTime === '--select--' ? null : endTime) }
                    conflictCallback={ hasConflict => setConflictSaturday(hasConflict) }
                />
            );
        }

        return (
            <div>
                { timeSunday }
                { timeMonday }
                { timeTuesday }
                { timeWednesday }
                { timeThursday }
                { timeFriday }
                { timeSaturday }
            </div>
        );
    }

    const hasConflicts = () => {
        let conflicts = [
            conflictSunday,
            conflictMonday,
            conflictTuesday,
            conflictWednesday,
            conflictThursday,
            conflictFriday,
            conflictSaturday
        ];

        return conflicts.some(c => c); // check if any value is true
    }

    const hasTimeSelected = () => {
        const selections = [
            startTimeSunday,
            endTimeSunday,
            startTimeMonday,
            endTimeMonday,
            startTimeTuesday,
            endTimeTuesday,
            startTimeWednesday,
            endTimeWednesday,
            startTimeThursday,
            endTimeThursday,
            startTimeFriday,
            endTimeFriday,
            startTimeSaturday,
            endTimeSaturday
        ];

        if(!selections.some(s => s)) {
            return false;
        }

        return true;
    }

    const hasStartAndEndTimeSelected = () => {
        if((startTimeSunday && !endTimeSunday) || (!startTimeSunday && endTimeSunday)) {
            return false;
        }

        if((startTimeMonday && !endTimeMonday) || (!startTimeMonday && endTimeMonday)) {
            return false;
        }

        if((startTimeTuesday && !endTimeTuesday) || (!startTimeTuesday && endTimeTuesday)) {
            return false;
        }

        if((startTimeWednesday && !endTimeWednesday) || (!startTimeWednesday && endTimeWednesday)) {
            return false;
        }

        if((startTimeThursday && !endTimeThursday) || (!startTimeThursday && endTimeThursday)) {
            return false;
        }

        if((startTimeFriday && !endTimeFriday) || (!startTimeFriday && endTimeFriday)) {
            return false;
        }

        if((startTimeSaturday && !endTimeSaturday) || (!startTimeSaturday && endTimeSaturday)) {
            return false;
        }
        
        return true;
    }

    const assign = () => {
        // if there are conflicts, don't allow the assignment to be created
        if(hasConflicts()) {
            setErrorMsg('Selection overlaps with an existing assignment');
            return;
        }

        if(!hasTimeSelected()) {
            setErrorMsg('Please select at least one time slot');
            return;
        }

        if(!hasStartAndEndTimeSelected()) {
            setErrorMsg('Please select both a start and end time');
            return;
        }

        setErrorMsg(null);
        let timeSlots = [];

        if(startTimeSunday && endTimeSunday) {
            timeSlots.push(
                {
                    day: 0,
                    start_time: startTimeSunday,
                    end_time: endTimeSunday
                }
            );
        }

        if(startTimeMonday && endTimeMonday) {
            timeSlots.push(
                {
                    day: 1,
                    start_time: startTimeMonday,
                    end_time: endTimeMonday
                }
            );
        }

        if(startTimeTuesday && endTimeTuesday) {
            timeSlots.push(
                {
                    day: 2,
                    start_time: startTimeTuesday,
                    end_time: endTimeTuesday
                }
            );
        }

        if(startTimeWednesday && endTimeWednesday) {
            timeSlots.push(
                {
                    day: 3,
                    start_time: startTimeWednesday,
                    end_time: endTimeWednesday
                }
            );
        }

        if(startTimeThursday && endTimeThursday) {
            timeSlots.push(
                {
                    day: 4,
                    start_time: startTimeThursday,
                    end_time: endTimeThursday
                }
            );
        }

        if(startTimeFriday && endTimeFriday) {
            timeSlots.push(
                {
                    day: 5,
                    start_time: startTimeFriday,
                    end_time: endTimeFriday
                }
            );
        }

        if(startTimeSaturday && endTimeSaturday) {
            timeSlots.push(
                {
                    day: 6,
                    start_time: startTimeSaturday,
                    end_time: endTimeSaturday
                }
            );
        }

        assignHpToServiceRequest(getAuthToken(), serviceRequest.id, healthProId, timeSlots)
            .then(res => {
                toggleModal();
                assignedCallback();
            });
    }

    return (
        <div>
            <button onClick={toggleModal} className="btn btn-outline-secondary">{buttonText}</button>
            <div className="modal" style={modalDisplay}>
                <div className="modal-content animate__animated animate__zoomIn">
                    <div>
                        <button onClick={toggleModal} className="btn btn-outline-danger pb-0 pt-0 pl-2 pr-2">&times;</button>
                    </div>

                    <h1 className="text-center">Assign to service request</h1>

                    <div style={{paddingLeft: '5%', paddingRight: '5%'}}>
                        <p className="text-center mb-4">
                            Select the days and times you want to assign for this healthcare professional. 
                            For any days you don't want to assign, leave the start and end time as --select--
                        </p>
                        { getTimeSlotForm() }
                        <button onClick={ assign } className="btn btn-primary mt-4">Assign</button>
                        { errorMsg ? <p className="text-danger mt-3">{ errorMsg }</p> : null }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ServAssignModal;
