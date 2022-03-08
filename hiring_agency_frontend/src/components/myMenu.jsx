import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthToken } from "../utils/storage";

function MyMenu(){
    
    const navigate = useNavigate();
    const changePassword = () => {
        navigate('/change_password');
    }

    const changeSQ = () => {
        navigate('/set_security_questions');
    }

    return (
        <div>
            <h4>Welcome to user center</h4>
            <div>
                This is user center, you can modify your personal information.
            </div>
            <hr />
            <h5>Change my password</h5>
            <div>
                You can change your password here, click the button below to continue.
            </div>
            <br/>
            <button onClick={ changePassword } className="btn btn-outline-primary" >Change my password</button>
            <hr />
            <h5>Change my security questions</h5>
            <div>
                You can change your security question here, click the button below to continue.
            </div>
            <br/>
            <button onClick={ changeSQ } className="btn btn-outline-primary" >Change security question</button>

        </div>
        
    );
}

export default MyMenu;
