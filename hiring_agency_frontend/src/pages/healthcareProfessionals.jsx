import React, { useEffect, useState } from "react";
import { getHPList } from "../api/HPRequests";
import HpCard from "../components/hpCard";
import { getAuthToken } from "../utils/storage";

function HealthcareProfessionals() {
    const [healthPros, setHealthPros] = useState([]);
    const [showActive, setShowActive] = useState(null);

    useEffect(() => {
        getHPList(getAuthToken(), null, showActive)
            .then(res => setHealthPros(res));
    }, [showActive]);

    return (
        <div className="row">
            <h1 className="text-center mb-5">Healthcare Professionals</h1>
            <div className="col-md-3">
                <div class="form-check form-switch">
                    <label class="form-check-label">All users</label>&nbsp;&nbsp;
                    <input 
                        onChange={ event => {
                            setShowActive(null)
                        }}        
                        type="radio"
                        checked = { showActive === null}  
                    />
                </div>
                <div class="form-check form-switch">
                    <label class="form-check-label">Active users</label>&nbsp;&nbsp;
                    <input 
                        value={ showActive } 
                        onChange={ event => {
                            setShowActive(true)
                        }}        
                        type="radio"
                        checked = { showActive === true}  
                    />
                </div>
                <div class="form-check form-switch">
                    <label class="form-check-label">Inactive users</label>&nbsp;&nbsp;
                    <input 
                        value={ !showActive } 
                        onChange={ event => {
                            setShowActive(false)
                        }}        
                        type="radio"
                        checked = { showActive === false}                 
                    />
                </div>
            </div>
            <div className="col-md-6">
                { healthPros.map(hp => {
                    return <HpCard 
                        key={ hp.id } 
                        hpId={ hp.id } 
                        name={ hp.user.first_name + ' ' + hp.user.last_name } 
                        status={ hp.user.is_active ? 'Active' : 'Inactive' }
                    />
                    }
                )}
            </div>
        </div>
    );
}

export default HealthcareProfessionals;
