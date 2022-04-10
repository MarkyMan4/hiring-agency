import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { retrieveHP } from "../api/HPRequests";
import HpCalendar from "../components/hpCalendar";
import { getAuthToken } from "../utils/storage";
import  {getAllServiceRequests} from "../api/serviceRequests";
import HealthProInfo from "../components/healthProInfo";

function HealthcareProDetail() {
    const { id } = useParams();
    const [healthPro, setHealthPro] = useState({});
    const [servRequests, setServRequests] = useState();
    useEffect(() => {
        retrieveHP(getAuthToken(), id)
            .then(res => setHealthPro(res) );
    }, [id]);
    useEffect(() => {
        getAllServiceRequests(getAuthToken(), true, false, id)
            .then(res => {console.log("test"); console.log(res);setServRequests(res)} );
    }, [id]);

    // TODO: useEffect to retrieve schedule of HP

    
const loadHPServs = () => {
    if(servRequests){
        console.log("running");
        return servRequests.map(srv => {
            return <div>
                    <h4 >{srv.patient_first_name + " " + srv.patient_last_name} </h4>
                    <a className="btn btn-primary mb-3" href={"#/service_requests/" + srv.id}>See Details</a>

                </div>
            }
        )
    }
};



    return (
        <div>
            <h1>{ healthPro?.user?.first_name } { healthPro?.user?.last_name }</h1>
            <hr />
            <HpCalendar hpId={ id } />
            <h1> Assigned Service Requests </h1>
            { loadHPServs()}
            <hr />
            <HealthProInfo healthPro={ healthPro } />
            
        </div>
    );



}
export default HealthcareProDetail;
