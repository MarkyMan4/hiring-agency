import React, { useState } from "react";
import { ThemeConsumer } from "react-bootstrap/esm/ThemeProvider";
import { useNavigate } from 'react-router-dom';
import { requestCareTakerAccount } from "../api/careTakerRequests";

function CareTakerAccountRequest() {
    let navigate = useNavigate();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [address, setAddress] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState({});

    const handleFormSubmit = (event) => {
        event.preventDefault(); // don't refresh page on form submit

        requestCareTakerAccount(firstName, lastName, address, phoneNumber, email)
            .then(res => navigate('/caretaker_acct_request_success')) // redirect to success page if request was successful
            .catch(err => setMessage(err.response.data));
    }

    return (
        <div>
            <h1>Care taker account request</h1>
            <p>
                Are you looking to request a service for a patient? The first step is to request an account for yourself. 
                One of our staff members will review the request and contact you to provide your credentials.
            </p>
            <hr />
            <form onSubmit={ handleFormSubmit } className="basic-form">
                <label>First name</label>
                <input 
                    required 
                    className="form-control mt-2" 
                    value = { firstName }
                    onChange={ event => setFirstName(event.target.value) }
                />

                <label className="mt-3">Last name</label>
                <input 
                    required 
                    className="form-control mt-2" 
                    value = { lastName }
                    onChange={ event => setLastName(event.target.value) }
                />

                <label className="mt-3">Address</label>
                <input 
                    required 
                    className="form-control mt-2" 
                    value = { address }
                    onChange={ event => setAddress(event.target.value) }
                />

                <label className="mt-3">Phone number</label>
                <input 
                    required 
                    className="form-control mt-2" 
                    placeholder="only enter digits, e.g. 1234567890" 
                    maxLength={10} 
                    minLength={10}
                    type="tel"
                    value = { phoneNumber }
                    onChange={ event => setPhoneNumber(event.target.value) }
                />

                <label className="mt-3">Email</label>
                <input 
                    required 
                    className="form-control mt-2" 
                    type="email"
                    value = { email }
                    onChange={ event => setEmail(event.target.value) }
                />

                <div className="text-danger mt-3">{ Object.keys(message).map((msg, indx) => <p key={ indx }>{ message[msg] }</p>) }</div>

                <button type="submit" className="btn btn-success mt-3">Submit</button>
            </form>
        </div>
    );
}

export default CareTakerAccountRequest;
