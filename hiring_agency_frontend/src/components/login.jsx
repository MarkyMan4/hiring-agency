import React, { useEffect, useState } from "react";
import { login } from "../api/authRequests";
import { setAuthToken } from "../utils/storage";
import { isUserLoggedIn } from "../utils/storage";
import { useNavigate } from 'react-router-dom';

function Login() {
    let navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        if(isUserLoggedIn())
            navigate('/');
    })
    
    const loginClicked = () => {
        login(username, password)
            .then(res => {
                setAuthToken(res.token);

                if(res.isFirstLogin) {
                    navigate('/change_password?info=firstlogin');
                    window.location.reload();
                }
                else
                    window.location.reload();
            })
            .catch(err => console.log(err));
    }

    const usernameChanged = (event) => {
        setUsername(event.target.value);
    }

    const passwordChanged = (event) => {
        setPassword(event.target.value);
    }

    // if the user is already logged in, redirect to home page
    const getLoginOrHome = () => {
        return (
            <div className="row w-100 mt-5">
                <div className="col-md-4"></div>
                <div className="col-md-4 text-center login-form shadow">
                    <h3 className="mt-2">Login</h3>
                    <hr />
                    <label className="mt-3">Username</label><br />
                    <input onChange={usernameChanged}></input><br />
                    <label className="mt-3">Password</label><br />
                    <input type="password" onChange={passwordChanged}></input><br />
                    <button className="btn btn-outline-success mt-5 mb-4" onClick={loginClicked}>Login</button>
                </div>
            </div>
        )
    }

    return getLoginOrHome();
}

export default Login;
