import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { getLockedList } from "../api/unlockUser";
import { getAuthToken } from "../utils/storage";
import UnlockUser from "../components/unlockUserCard"

function UnlockUserList(){
    const [lockedList, setLockedList] = useState([]);

    useEffect(() =>{
        getLockedList(getAuthToken())
            .then(res => setLockedList(res));
    },[]);

    const getLockedUserList = () =>{
        if(lockedList.length ===0){
            return <h2 className="text-center">There is no locked user</h2>
        }
        else{
            return(
                <div>
                    { lockedList.map(req =>(
                        <UnlockUser
                            userId = {req.id}
                            name = {req.user.username}
                        />
                    ))}
                </div>
            )
        }
    }

    return(
        <div className="row">
            <h1 className="text-center mb-5">locked user list</h1>
            <div className="col-md-3"></div>
            <div className="col-md-6">
                { getLockedUserList()}
            </div>
        </div>
    )
}

export default UnlockUserList;