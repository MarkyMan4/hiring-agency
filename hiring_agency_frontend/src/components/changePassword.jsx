import React, { useEffect, useState } from "react";
import { getAuthToken, isUserLoggedIn } from "../utils/storage";
import { changePassword } from "../api/authRequests";
import { useNavigate, useLocation } from 'react-router-dom';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function ChangePassword() {
    let navigate = useNavigate();
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [topMessage, setTopMessage] = useState(''); // this can be used for things like setting a helpful message when it is the users first time logging in

    let query = useQuery();

    useEffect(() => {
        if(!isUserLoggedIn())
            navigate('/login');

        if(query.get('info') === 'firstlogin')
            setTopMessage('Looks like this is your first time logging in. Please change you password before proceding.');
    });

    const handleOldPassInput = (event) => {
        setOldPassword(event.target.value);
    }

    const handleNewPassInput = (event) => {
        setNewPassword(event.target.value);
    }

    const changePasswordClicked = () => {
        // determine if password change was successful and display a message
        if(oldPassword === newPassword) {
            setMessage('new password cannot be the same as old password');
        }
        else {
            changePassword(getAuthToken(), oldPassword, newPassword)
                .then(res => {
                    console.log(res);
                    if(res.error)
                        setMessage(res.error);
                    else {
                        setMessage('password successfully changed');

                        if(query.get('info') === 'firstlogin')
                            navigate('/set_security_questions');
                    }
                })
                .catch(err => console.log(err));
        }
    }

    return (
        <div>
            <div className="mb-4">{ topMessage }</div>
            <label>Old password</label><br />
            <input onChange={ handleOldPassInput } type="password"></input><br />
            <label className="mt-3">New password</label><br />
            <input onChange={ handleNewPassInput } type="password"></input><br />
            <button onClick={ changePasswordClicked } className="btn btn-success mt-3">Change password</button>
            <div className="mt-3">{ message }</div>
        </div>
    );
}

export default ChangePassword;
