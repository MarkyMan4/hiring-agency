import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { retrieveHP } from "../api/HPRequests";
import HpCalendar from "../components/hpCalendar";
import { getAuthToken } from "../utils/storage";
import { getHpSchedule } from "../api/HPRequests";
function HealthcareProDetail() {
    const { id } = useParams();
    const [healthPro, setHealthPro] = useState({});
    const [hpSchedule, setHPSchedule] = useState();

    useEffect(() => {
        retrieveHP(getAuthToken(), id)
            .then(res => setHealthPro(res) );
    }, [id]);

    useEffect(() => {
        getHpSchedule(getAuthToken(), id)
            .then(res =>{ setHPSchedule(res); console.log(res) });
    }, [id]);

    // TODO: useEffect to retrieve schedule of HP

    return (
        <div>
            <h1>{ healthPro?.user?.first_name } { healthPro?.user?.last_name }</h1>
            <hr />
            <HpCalendar hpId={ id } />
        </div>
    );
}

export default HealthcareProDetail;
