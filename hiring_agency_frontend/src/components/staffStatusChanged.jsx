import React from "react";
import { useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { changeStaffStatus } from "../api/staffManage";
import { getAuthToken } from "../utils/storage";

function StaffStatusChanged() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    useEffect(() => {
        changeStaffStatus(getAuthToken(), id)
    },[]);

    const back = () =>{
        navigate('/view_staff_list');
    }
    return(
        <div>
            <div className="row">
                    <div className="col-md-6">
                        <h1>You just change the status of this staff</h1>
                    </div>
                    <div className="col-md-6">
                        <button onClick={ back } className="btn btn-outline-primary" style={ {float: 'right'} }>Back</button>
                    </div>
                </div>
            <hr/>
            <p>If staff wants to login to the system, the status of account must be "active".</p>
            <p>Set account as "inactive" does not means delete this user, you can set it as "active" to let this account can be used again.</p>
            <p>Click the "back" button to back to staff list.</p>
            

        </div>
    )

}
export default StaffStatusChanged; 