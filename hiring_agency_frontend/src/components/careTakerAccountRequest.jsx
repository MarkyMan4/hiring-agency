import React, { useState } from "react";

function CareTakerAccountRequest() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [address, setAddress] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');

    const handleFormSubmit = (event) => {
        event.preventDefault();
        alert('submitted');
        
        // redirect to home page
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
                    value = { phoneNumber }
                    onChange={ event => setPhoneNumber(event.target.value) }
                />

                <label className="mt-3">Email</label>
                <input 
                    required 
                    className="form-control mt-2" 
                    value = { email }
                    onChange={ event => setEmail(event.target.value) }
                />

                <button type="submit" className="btn btn-success mt-3">Submit</button>
            </form>
        </div>
    );
}

export default CareTakerAccountRequest;
