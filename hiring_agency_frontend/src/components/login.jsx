import React, { useState } from "react";
import { login } from "../api/authRequests";

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [output, setOutput] = useState({});
    
    const loginClicked = () => {
        login(username, password)
            .then(res => setOutput(res))
            .catch(err => console.log(err));
    }

    const usernameChanged = (event) => {
        setUsername(event.target.value);
    }

    const passwordChanged = (event) => {
        setPassword(event.target.value);
    }

    return (
        <div>
            
                <input onChange={usernameChanged}></input><br />
                <input type="password" onChange={passwordChanged}></input><br />
                <button className="btn btn-outline-success" onClick={loginClicked}>login</button>
            
            <div>
                {JSON.stringify(output)}
            </div>
        </div>
    );
}

export default Login;
