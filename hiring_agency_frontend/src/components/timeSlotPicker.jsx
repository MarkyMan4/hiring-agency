import React, { useEffect, useState } from "react";

const dayMap = {
    0: 'Sunday',
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday'
};

// day should be 0 - 6 with 0 being sunday
function TimeSlotPicker({ day, schedule, serviceStartDate, serviceEndDate, minTime, maxTime, startTimeCallback, endTimeCallback, conflictCallback }) {
    const [startTimeMsg, setStartTimeMsg] = useState();
    const [endTimeMsg, setEndTimeMsg] = useState();
    const [fullTimeOverlapMsg, setFullTimeOverlapMsg] = useState();
    const [serviceTimeOptions, setServiceTimeOptions] = useState([]);
    const [selectedStartTime, setSelectedStartTime] = useState();
    const [selectedEndTime, setSelectedEndTime] = useState();

    useEffect(() => {
        let options = [];

        // create all times in 30 minute increments
        for(let i = 0; i < 24; i++) {
            let hour = i.toString().padStart(2, '0');
            options.push(
                {
                    twentyFourHourTime: `${ hour }:00`,
                    twelveHourTime: `${ i > 12 ? i - 12 : i }:00 ${ i >= 12 ? 'PM' : 'AM' }`
                }
            );

            options.push(
                {
                    twentyFourHourTime: `${ hour }:30`,
                    twelveHourTime: `${ i > 12 ? i - 12 : i }:30 ${ i >= 12 ? 'PM' : 'AM' }`
                }
            );
        }

        let min = removeMicroSecondsFromTime(minTime);
        let max = removeMicroSecondsFromTime(maxTime);
        
        options = options.filter(o => o.twentyFourHourTime >= min && o.twentyFourHourTime <= max);
        setServiceTimeOptions(options);
    }, [minTime, maxTime]);

    const removeMicroSecondsFromTime = (timeStr) => {
        let timeParts = timeStr.split(':');

        return `${timeParts[0]}:${timeParts[1]}`;
    }

    const parseTime = (timeStr) => {
        let timeParts = timeStr.split(':');
        return new Date(1, 1, 1, parseInt(timeParts[0]), parseInt(timeParts[1]));
    }

    // setting isStartDate determines how the checks for overlapping times are performed
    // TODO: this function and hasFullTimeOverlap could be combined into one
    const isTimeOverlapping = (selection, isStartDate) => {
        let selectedTime = parseTime(selection);

        let dates = Object.keys(schedule);

        for(let i = 0; i < dates.length; i++) {
            let d = dates[i];
            let dateParts = d.split('-');
            let year = parseInt(dateParts[0]);
            let month = parseInt(dateParts[1]) - 1;
            let dayOfMonth = parseInt(dateParts[2]);
            let date = new Date(year, month, dayOfMonth);
            
            if(date >= serviceStartDate && date <= serviceEndDate && date.getDay() === day) {
                for(let j = 0; j < schedule[d].length; j++) {
                    let time = schedule[d][j];
                    let startTime = parseTime(time.start_time);
                    let endTime = parseTime(time.end_time);

                    if(isStartDate) {
                        if(selectedTime >= startTime && selectedTime < endTime) {
                            return true;
                        }
                    }
                    else {
                        if(selectedTime > startTime && selectedTime <= endTime) {
                            return true;
                        }
                    }
                }
            }
        }

        return false;
    }

    const hasFullTimeOverlap = (start, end) => {
        let selStartTime = parseTime(start);
        let selEndTime = parseTime(end);

        let dates = Object.keys(schedule);

        for(let i = 0; i < dates.length; i++) {
            let d = dates[i];
            let dateParts = d.split('-');
            let year = parseInt(dateParts[0]);
            let month = parseInt(dateParts[1]) - 1;
            let dayOfMonth = parseInt(dateParts[2]);
            let date = new Date(year, month, dayOfMonth);
            
            if(date >= serviceStartDate && date <= serviceEndDate && date.getDay() === day) {
                for(let j = 0; j < schedule[d].length; j++) {
                    let time = schedule[d][j];
                    let startTime = parseTime(time.start_time);
                    let endTime = parseTime(time.end_time);

                    if(selStartTime < startTime && selEndTime > endTime) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    const validateStartTimeSelection = (event) => {
        let selection = event.target.value;
        setSelectedStartTime(selection === '' ? null : selection);

        if(selection !== '' && selectedEndTime && hasFullTimeOverlap(selection, selectedEndTime)) {
            setStartTimeMsg(null);
            setFullTimeOverlapMsg('Selected times overlap with an existing assignment');
            conflictCallback(true);
            return;
        }
        else {
            setFullTimeOverlapMsg(null);
            conflictCallback(false);
        }

        if(isTimeOverlapping(selection, true)) {
            setStartTimeMsg('Selected start time overlaps with an existing assignment');
            conflictCallback(true);
        }
        else {
            conflictCallback(false);
            setStartTimeMsg(null);
            startTimeCallback(selection === '' ? null : selection);
        }
    }

    const validateEndTimeSelection = (event) => {
        let selection = event.target.value;
        setSelectedEndTime(selection === '' ? null : selection);

        if(selection !== '' && selectedStartTime && hasFullTimeOverlap(selectedStartTime, selection)) {
            setEndTimeMsg(null);
            setFullTimeOverlapMsg('Selected times overlap with an existing assignment');
            conflictCallback(true);
            return;
        }
        else {
            setFullTimeOverlapMsg(null);
            conflictCallback(false);
        }

        if(isTimeOverlapping(selection, false)) {
            setEndTimeMsg('Selected end time overlaps with an existing assignment');
            conflictCallback(true);
        }
        else {
            conflictCallback(false);
            setEndTimeMsg(null);
            endTimeCallback(selection === '' ? null : selection);
        }
    }

    return (
        <div>
            <div className="mb-4 row">
                <h4><b>{ dayMap[day] }</b></h4>
                <div className="col-md-2">
                    <label>Service start time</label>
                    <select onChange={ validateStartTimeSelection } className="form-select">
                        <option value=''>--select--</option>
                        { serviceTimeOptions.map((time, indx) => <option value={ time.twentyFourHourTime } key={ indx }>{ time.twelveHourTime }</option>) }
                    </select>
                </div>

                <div className="col-md-2">
                    <label>Service end time</label>
                    <select onChange={ validateEndTimeSelection } className="form-select">
                        <option value=''>--select--</option>
                        { serviceTimeOptions.map((time, indx) => <option value={ time.twentyFourHourTime } key={ indx }>{ time.twelveHourTime }</option>) }
                    </select>
                </div>
            </div>

            { startTimeMsg ? <p className="text-danger">{ startTimeMsg }</p> : null }
            { endTimeMsg ? <p className="text-danger">{ endTimeMsg }</p> : null }
            { fullTimeOverlapMsg ? <p className="text-danger">{ fullTimeOverlapMsg }</p> : null }
        </div>
    );
}

export default TimeSlotPicker;
