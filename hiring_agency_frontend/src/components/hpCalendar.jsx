import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import { getHpSchedule } from "../api/HPRequests";
import { getAuthToken } from "../utils/storage";

const localizer = momentLocalizer(moment);

function HpCalendar({ hpId }) {
    const [events, setEvents] = useState([]); // this is the HP schedule, formatted as needed for react-big-calendar

    /*
     * Events format:
     * [
     *      {
     *          id: 0,
     *          title : "test event",
     *          allDay : false,
     *          start : '2022-04-02T05:00:00.000Z',
     *          end : '2022-04-02T12:00:00.000Z'
     *      },
     *      {
     *          id: 1,
     *          ...
     *      },
     *      ...
     *  ]
     */
    useEffect(() => {
        getHpSchedule(getAuthToken(), hpId)
            .then(res => {
                let schedule = [];

                Object.keys(res).forEach(date => {
                    res[date].forEach((timeSlot, indx) => {
                        const event = {
                            id: indx,
                            title: timeSlot.patient,
                            allDay: false,
                            start: new Date(`${date}T${timeSlot.start_time}`),
                            end: new Date(`${date}T${timeSlot.end_time}`)
                        }
                        
                        schedule.push(event);
                    });
                });

                setEvents(schedule);
            });
    }, []);

    return (
        <div>
            <Calendar
                localizer={ localizer }
                events={ events }
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
            />
        </div>
    );
}

export default HpCalendar;
