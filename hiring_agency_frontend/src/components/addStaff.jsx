import React, { useEffect, useState } from "react";
import { addNewStaff } from "../api/authRequests";
import { useNavigate, useLocation } from 'react-router-dom';
import { getAuthToken, isUserLoggedIn } from '../utils/storage';


function useQuery() {
    return new URLSearchParams(useLocation().search);
}
function AddStaff() {
    let navigate = useNavigate();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState('');
    const [username, setUsername] = useState('');

    let query = useQuery();

    useEffect(() =>{
        if(!isUserLoggedIn())
            navigate('/login');
    });

    const handleFirstName = (event) =>{
        setFirstName(event.target.value);
    }
    const handleLastName = (event) =>{
        setLastName(event.target.value);
    }
    const handleEmail = (event) =>{
        setEmail(event.target.value);
    }
    const handleAddress = (event) =>{
        setAddress(event.target.value);
    }
    const handlePhone = (event) =>{
        setPhone(event.target.value);
    }

    const addStaffClicked = (event) =>{ 
        event.preventDefault();

        addNewStaff(getAuthToken(), firstName, lastName, email, phone, address)
            .then(res =>{
                setUsername(res.user.username);
                setShowPassword(res.initialPassword);
                setMessage({});
                    
            })
            .catch(err => setMessage(err.response.data));
    }
    return (
        <div>
            <h1>Add a new staff member to the agency</h1>
            <hr />
            <form id="newjobpostform" className="basic-form" onSubmit={ addStaffClicked }>
                <label>First name</label>
                <input onChange={ handleFirstName } className="form-control mt-2" required></input>

                <label className="mt-3">Last name</label>
                <input onChange={ handleLastName } className="form-control mt-2" required></input>

                <label className="mt-3">Email</label>
                <input onChange={ handleEmail } type="email" className="form-control mt-2" required></input>

                <label className="mt-3">Phone number</label>
                <input onChange={ handlePhone } type="tel" placeholder="only enter digits, e.g. 1234567890" maxLength={10} minLength={10} className="form-control mt-2" required></input>

                <label className="mt-3">Address</label>
                <input onChange={ handleAddress } className="form-control mt-2" required></input>

                <button type="submit" className= "btn btn-success mt-2">Add Staff</button>
            </form>
            <div className="text-danger mt-3">{ Object.keys(message).map((msg, indx) => <p key={ indx }><b>{ msg.replaceAll('_', ' ') }</b>: { message[msg] }</p>) }</div>
            <div className="mt-4">{ username === '' ? '' : 'The username for this account is: ' + username}</div>
            <div className="mt-4">{ showPassword === '' ? '' : 'The initial password for this account is: ' + showPassword}</div>
        </div>
    );
}

export default AddStaff;