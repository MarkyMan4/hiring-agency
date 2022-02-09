import React, { useEffect, useState } from "react";
import { addNewStaff } from "../api/authRequests";
import { useNavigate, useLocation } from 'react-router-dom';
import { getAuthToken, isUserLoggedIn } from '../utils/storage';


function useQuery() {
    return new URLSearchParams(useLocation().search);
}
function AddStaff() {
    let navigate = useNavigate();

    const[firstName, setFirstName] = useState('');
    const[lastName, setLastName] = useState('');
    const[email, setEmail] = useState('');
    const[address, setAddress] = useState('');
    const[phone, setPhone] = useState('');
    const[isStaff, setIsStaff] = useState('');
    const[isActive, setIsActive] = useState('');

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
    const handleEmail = (event) =>{
        setEmail(event.target.value);
    }

    const addStaffCliked = () =>{ 
        if(firstName==null){
            setMessage('Please enter user`s first name')
        }
        else if(LastName==null){
            setMessage('Please enter user`s last name')
        }
        else if(email==null){
            setMessage('Please enter user`s email')
        }
        else if(address==null){
            setMessage('Please enter user`s address')
        }
        else if(phone==null){
            setMessage('Please enter user`s phone number')
        }
        else{
            addNewStaff(firstName,lastName,email,phone,address)
                .then(res =>{
                    if(res.error)
                        setMessage(res.error);
                    else
                        setMessage('Add new staff success');

                })
                .catch(err => console.log(err));
        }
    }
    return (
        <div>
            <div className="mb-4">{ topMessage }</div>
            <label>First name</label><br/>
            <input onChange={ handleFirstName }></input><br/>
            <label>Last name</label><br/>
            <input onChange={ handleLastName }></input><br/>
            <label>Email</label><br/>
            <input onChange={ handleEmail } type="email"></input><br/>
            <label>Phone number</label><br/>
            <input onChange={ handlePhone } type="number" maxLength={10} minLength={10}></input><br/>
            <label>Address</label><br/>
            <input onChange={ handleAddress }></input><br/>
            <button onClick={ addStaffCliked } className= "btn btn-success mt-2">Add Staff</button>
            <div className="mt-3">{ message }</div>
        </div>
    );
}

export default AddStaff;