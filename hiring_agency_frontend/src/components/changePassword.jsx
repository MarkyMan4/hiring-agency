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
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [topMessage, setTopMessage] = useState(''); // this can be used for things like setting a helpful message when it is the users first time logging in

    let query = useQuery();

    useEffect(() => {
        if(!isUserLoggedIn())
            navigate('/login');

        if(query.get('info') === 'firstlogin')
            setTopMessage('Looks like this is your first time logging in. Please change your password before proceding.');
    });

    const handleOldPassInput = (event) => {
        setOldPassword(event.target.value);
    }

    const handleNewPassInput = (event) => {
        setNewPassword(event.target.value);
    }

    const handleConfirmPassInput = (event) => {
        setConfirmPassword(event.target.value);
    }

    const changePasswordClicked = () => {
        // determine if password change was successful and display a message
        changePassword(getAuthToken(), oldPassword, newPassword)
            .then(res => {
                if(res.error)
                    setMessage(res.error);
                else {
                    if(newPassword!==confirmPassword){
                        setMessage('The new password is not same as comfirm password')
                    }
                    else{
                        setMessage('password successfully changed');
                        setOldPassword('');
                        setNewPassword('');
                        setConfirmPassword('');
                        if(query.get('info') === 'firstlogin')
                            navigate('/set_security_questions');
                    }
                    
                }
            })
            .catch(err => console.log(err));
    }

    return (
        <div>
            <h4>Please change your password.</h4>
            <div>
                Password must be at least six characters, only contain alphanumeric characters and at least one of the following: ~, !, @, #, $, %, ^, &, *, +
            </div>
            <hr />
            <form id="changePasswordForm" className="basic-form">
            <div className="mb-4">{ topMessage }</div>
            <label className="mt-4">Old password</label><br />
            <input value={ oldPassword } onChange={ handleOldPassInput } type="password" className="form-control mt-2" ></input><br />
            <label className="mt-3">New password</label><br />
            <input value={ newPassword } onChange={ handleNewPassInput } type="password" className="form-control mt-2" ></input><br />
            <label className="mt-3">Confirm new password</label><br />
            <input value={ confirmPassword } onChange={ handleConfirmPassInput } type="password" className="form-control mt-2" ></input><br />
            <button onClick={ changePasswordClicked } className="btn btn-success mt-3">Change password</button>
            </form>
            <div className="mt-3">{ message }</div>
        </div>
    );
}

export default ChangePassword;
