import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { retrieveHP } from "../api/HPRequests";
import HpCalendar from "../components/hpCalendar";
import { getAuthToken } from "../utils/storage";

function HealthcareProDetail() {
    const { id } = useParams();
    const [healthPro, setHealthPro] = useState({});

    useEffect(() => {
        retrieveHP(getAuthToken(), id)
            .then(res => setHealthPro(res) );
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
