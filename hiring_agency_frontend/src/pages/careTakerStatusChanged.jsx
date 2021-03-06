import React from "react";
import { useEffect,useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { changeCareTakerStatus } from "../api/careTakerManage";
import { getAuthToken } from "../utils/storage";

function CareTakerStatusChanged() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [message, setMessage] = useState('');

    useEffect(() => {
        changeCareTakerStatus(getAuthToken(), id)
        .then(res => {
            setMessage(res.error);
        })
    },[]);

    const back = () =>{
        navigate('/view_caretaker_list');
    }
    return(
        <div>
            <div className="row">
                    <div className="col-md-6">
                        <h1>{ message }</h1>
                    </div>
                    <div className="col-md-6">
                        <button onClick={ back } className="btn btn-outline-primary" style={ {float: 'right'} }>Back</button>
                    </div>
                </div>
            <hr/>
            <p>If care taker wants to login to the system, the status of account must be "active".</p>
            <p>Set account as "inactive" does not means delete this user, you can set it as "active" to let this account can be used again.</p>
            <p>Click the "back" button to back to care taker list.</p>
            

        </div>
    )

}
export default CareTakerStatusChanged; 