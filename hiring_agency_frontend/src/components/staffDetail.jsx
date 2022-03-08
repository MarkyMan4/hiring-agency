import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { getStaffById } from "../api/staffManage";
import { getAuthToken } from "../utils/storage";

function StaffDetail(){
    const { id } = useParams();
    const navigate = useNavigate();
    const [request, setRequest] = useState({});

    useEffect(() =>{
        getStaffById(getAuthToken(), id)
            .then(res => setRequest(res));
    }, []);

    const cancel = () =>{
        navigate('/view_staff_list');
    }

    const changeStatus = () =>{
        navigate(`/view_staff_list/${id}/status`);
    }

    if(Object.keys(request).length > 0){
        return(
            <div>
                <div className="row">
                    <div className="col-md-6">
                        <h1>Staff Information</h1>
                    </div>
                    <div className="col-md-6">
                        <button onClick={ cancel } className="btn btn-outline-primary" style={ {float: 'right'} }>Cancel</button>
                    </div>
                </div>
                <hr/>
                <p><b>Username: </b>{request.user.username}</p>
                <p><b>Name: </b>{ request.user.first_name } { request.user.last_name }</p>
                <p><b>Phone: </b>{request.phone_number}</p>
                <p><b>Email: </b>{ request.email } </p>
                <p><b>Address: </b>{ request.address }</p>
                <p><b>Status: </b>{ request.user.is_active ? "Active" : "Inactive" }</p>
                <p><b>Time of last login: </b>{ request.user.last_login }</p>
                <p><b>Time of join system: </b>{ request.user.date_joined }</p>

                <button onClick={ changeStatus } className="btn btn-outline-danger">{ request.user.is_active ? "Set inactive" : "Set active" }</button>
            </div>
        );
    }
    else{
        return(
            <div>
            <h1>Loading...</h1>
            </div>
        );    
    }
}   

export default StaffDetail;