import React, { useEffect, useState } from "react";
import HpCalendar from "../components/hpCalendar";
import { getAuthToken } from "../utils/storage";
import  {getAllServiceRequests} from "../api/serviceRequests";
import {getUser} from "../api/authRequests"
import {getHPList} from "../api/HPRequests"
import HealthProInfo from "../components/healthProInfo";

function HealthcareProPersonalDetail() {
    const [healthPro, setHealthPro] = useState({});
    const [servRequests, setServRequests] = useState();
    useEffect(() => {
        getUser(getAuthToken())
            .then(res =>{ 
                getHPList(getAuthToken())
                    .then(r => setHealthPro(r))
            });
    }, []);
    useEffect(() => {
        getAllServiceRequests(getAuthToken(), true, false)
            .then(res => setServRequests(res));
    }, [healthPro]);
    
    const loadHPServs = () => {
        if(servRequests){
            return servRequests.map(srv => {
                return <div>
                        <h4 >{srv.patient_first_name + " " + srv.patient_last_name} </h4>
                        <a className="btn btn-primary mb-3" href={"#/hp_service_requests/" + srv.id}>See Details</a>

                    </div>
                }
            )
        }
    };

    return (
        <div>
            <h1>{ healthPro?.user?.first_name } { healthPro?.user?.last_name }</h1>
            <hr />
            { healthPro.id ? <HpCalendar hpId={ healthPro.id} /> : null}
            <h1> Assigned Service Requests </h1>
            { loadHPServs()}
            <hr />
            <HealthProInfo healthPro={ healthPro } />
        </div>
    );
}
export default HealthcareProPersonalDetail;
