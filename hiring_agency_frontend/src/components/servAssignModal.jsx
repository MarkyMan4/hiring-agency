import React, { useState } from "react";

function ServAssignModal({ buttonText, healthProId, servReqId }) {
    const [display, setDisplay] = useState('none');

    let modalDisplay = {
        display: display
    }

    const toggleModal = () => {
        if(display === 'none')
            setDisplay('flex');
        else
            setDisplay('none');
    }

    // const assign = (event) => {
    //     event.preventDefault();
    //     assignHpToServiceRequest(getAuthToken(), id, event.target.value)
    //         .then(res => setIsAssigned(true))
    //         .catch(err => console.log(err.response.data));
    // }

    return (
        <div>
            <button onClick={toggleModal} className="btn btn-outline-secondary">{buttonText}</button>
            <div className="modal" style={modalDisplay}>
                <div className="modal-content animate__animated animate__zoomIn">
                    <div>
                        <button onClick={toggleModal} className="btn btn-outline-danger pb-0 pt-0 pl-2 pr-2">&times;</button>
                    </div>

                    <h1 className="text-center">Assign to service request</h1>
                </div>
            </div>
        </div>
    );
}

export default ServAssignModal;
