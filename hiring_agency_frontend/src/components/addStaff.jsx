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

    const addStaffCliked = () =>{ 
        if(!firstName || firstName.trim() === ''){
            setMessage('Please enter user`s first name')
        }
        else if(!lastName || lastName.trim() === ''){
            setMessage('Please enter user`s last name')
        }
        else if(!email || email.trim() === ''){
            setMessage('Please enter user`s email')
        }
        else if(!address || address.trim() === ''){
            setMessage('Please enter user`s address')
        }
        else if(!phone || phone.trim() === ''){
            setMessage('Please enter user`s phone number')
        }
        else{
            addNewStaff(getAuthToken(), firstName, lastName, email, phone, address)
                .then(res =>{
                    if(res.error)
                        setMessage(res.error);
                    else {
                        setUsername(res.user.username);
                        setShowPassword(res.initialPassword);
                        setMessage('Add new staff success');
                    }
                        
                })
                .catch(err => console.log(err));
        }
    }
    return (
        <div>
            <label>First name</label><br/>
            <input onChange={ handleFirstName } required></input><br/>
            <label>Last name</label><br/>
            <input onChange={ handleLastName } required></input><br/>
            <label>Email</label><br/>
            <input onChange={ handleEmail } type="email"></input><br/>
            <label>Phone number</label><br/>
            <input onChange={ handlePhone } type="tel"  maxLength={10} minLength={10}></input><br/>
            <label>Address</label><br/>
            <input onChange={ handleAddress }></input><br/>
            <button onClick={ addStaffCliked } className= "btn btn-success mt-2">Add Staff</button>
            <div className="mt-3">{ message }</div>
            <div className="mt-4">{ username === '' ? '' : 'The username for this account is: ' + username}</div>
            <div className="mt-4">{ showPassword === '' ? '' : 'The initial password for this account is: ' + showPassword}</div>
        </div>
    );
}

export default AddStaff;