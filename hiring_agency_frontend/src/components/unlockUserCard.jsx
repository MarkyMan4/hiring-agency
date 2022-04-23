import React, { useEffect, useState } from "react";
import { getAuthToken } from "../utils/storage";
import { changeToUnlock } from "../api/unlockUser";



function UnlockUser({userId, name }) {

    const [showElem, setShowElem] = useState(true);
    const unlock = () =>{
        changeToUnlock(getAuthToken(),userId)
        .catch(err => console.log(err));
        setShowElem(false);              
    }
    
    return (
            showElem?(
            <div className="staff-card shadow animate__animated animate__fadeInUp">
                <h4>{ name } <button onClick={ unlock } style={{float: 'right'}} className="btn btn-outline-danger">Unlock</button> </h4>
                
            </div>
        ):
            <div className="staff-card shadow animate__animated animate__fadeInUp">
                <h4>{ name }  <button disabled onClick={ unlock } style={{float: 'right'}} className="btn btn-outline-successs">User Unlocked</button> </h4>
                
            </div>     
    );
}

export default UnlockUser;
