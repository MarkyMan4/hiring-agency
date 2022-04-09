import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CancelButton from "../components/cancelButton";

function CreateServiceEntry() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [dateOfService, setDateOfService] = useState();
    const [startTime, setStartTime] = useState();
    const [endTime, setEndTime] = useState();
    const [hpId, setHpId] = useState(); // only used if an admin is creating the service entry for an HP
    const [message, setMessage] = useState();

    const handleFormSubmit = (event) => {
        event.preventDefault(); // don't refresh page on form submit

        // todo: use end point to save form data

        navigate(`/enter_service/${id}/success`);
    }

    return (
        <div>
            <div className="row animate__animated animate__fadeIn">
                <div className="col-md-6">
                    <h1>Create service entry for service { id }</h1>
                </div>
                <div className="col-md-6">
                    <CancelButton returnUrl="/enter_service" style={ {float: 'right'} } />
                </div>
                <hr />
            </div>
            <form onSubmit={handleFormSubmit} className="basic-form">
                {/* only admin is required to enter the username of the care taker */}
                {/* { roles.includes('admin') ?
                    <div>
                        <label><span className="text-danger">*</span>Care taker username</label>
                        <input 
                            required 
                            className="form-control mt-2" 
                            value = { careTakerUsername }
                            onChange={ event => setCareTakerUsername(event.target.value) }
                        />
                    </div>
                    : <div></div>
                } */}

                <label><span className="text-danger">*</span>Date of service</label>
                <input type="date" onChange={ (event) => setDateOfService(event.target.value) } className="form-control mt-2" required />

                <label className="mt-3"><span className="text-danger">*</span>Start time</label>
                <input type="time" onChange={ (event) => setStartTime(event.target.value) } className="form-control mt-2" required />

                <label className="mt-3"><span className="text-danger">*</span>End time</label>
                <input type="time" onChange={ (event) => setEndTime(event.target.value) } className="form-control mt-2" required />

                <button type="submit" className="btn btn-primary mt-4">Submit</button>
            </form>

            { message ? <p className="mt-5">{ message }</p> : null }
        </div>
    );
}

export default CreateServiceEntry;
