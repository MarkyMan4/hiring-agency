import React, { useEffect, useState } from "react";
import { getHPList } from "../api/HPRequests";
import HpCard from "../components/hpCard";
import { getAuthToken } from "../utils/storage";

function HealthcareProfessionals() {
    const [healthPros, setHealthPros] = useState([]);

    useEffect(() => {
        getHPList(getAuthToken())
            .then(res => setHealthPros(res));
    }, []);

    return (
        <div>
            <h1 className="text-center mb-5">Healthcare Professionals</h1>
            <div className="row">
                <div className="col-md-3"></div>
                <div className="col-md-6">
                    { healthPros.map(hp => {
                        return <HpCard 
                            key={ hp.id } 
                            hpId={ hp.id } 
                            name={ hp.user.first_name + ' ' + hp.user.last_name } 
                        />
                        }
                    )}
                </div>
            </div>
        </div>
    );
}

export default HealthcareProfessionals;
