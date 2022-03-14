import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { getAllStaff } from "../api/staffManage"
import { getAuthToken } from "../utils/storage";
import StaffCard from "../components/staffCard";

function StaffList(){
    const [staffList, setStaffList] = useState([]);
    const [showActive, setShowActive] = useState(null);

    useEffect(() => {
        getAllStaff(getAuthToken(), showActive)
            .then(res => setStaffList(res));
    }, [showActive]);

    const getStaffList = () =>{
        if(staffList.length === 0){
            return <h2 className="text-center">There is no staff</h2>
        }
        else{
            return(
                <div>
                    { staffList.map(req => (    
                        <StaffCard
                            requestId={ req.id }
                            username={req.user.username}
                            status = {req.user.is_active ? "Active" : "Inactive"}
                        />
                    ))}
                </div>
            )
        }
    }

    return (
        <div className="row">
            <h1 className="text-center mb-5">Staff List</h1>
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
                { getStaffList() }
            </div>
        </div>
    );
}

export default StaffList;