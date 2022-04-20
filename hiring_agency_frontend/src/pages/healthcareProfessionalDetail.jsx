import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { flipActiveStatus, retrieveHP } from "../api/HPRequests";
import HpCalendar from "../components/hpCalendar";
import { getAuthToken } from "../utils/storage";
import  {getAllServiceRequests} from "../api/serviceRequests";
import HealthProInfo from "../components/healthProInfo";
import CancelButton from "../components/cancelButton";

function HealthcareProDetail() {
    const { id } = useParams();
    const [healthPro, setHealthPro] = useState({});
    const [servRequests, setServRequests] = useState();
    const [changeStatusTrigger, setChangeStatusTrigger] = useState(false);
    const [display, setDisplay] = useState('none');
    const [modalMessage, setModalMessage] = useState('');

    useEffect(() => {
        retrieveHP(getAuthToken(), id)
            .then(res => setHealthPro(res) );

        getAllServiceRequests(getAuthToken(), true, false, id)
            .then(res => setServRequests(res) );
    }, [id, changeStatusTrigger]);

    let modalDisplay = {
        display: display
    }

    const toggleModal = () => {        
        if(display === 'none')
            setDisplay('flex');
        else
            setDisplay('none');
    }

    const loadHPServs = () => {
        if(servRequests){
            return servRequests.map(srv => {
                return <div>
                        <h4 >{srv.patient_first_name + " " + srv.patient_last_name} </h4>
                        <a className="btn btn-primary mb-3" href={"#/service_requests/" + srv.id}>See Details</a>

                    </div>
                }
            )
        }
    };

    const softDelete = () => {
        flipActiveStatus(getAuthToken(), id)
            .then(res => {
                setChangeStatusTrigger(!changeStatusTrigger);
                
                if(res.error) {
                    setModalMessage(res.error);
                }
                else if(res.user.is_active) {
                    setModalMessage('Account is now active');
                }
                else {
                    setModalMessage('Account has been deactivated');
                }
                toggleModal();
            })
            .catch(err => {
                setModalMessage(err.response.data);
                toggleModal();
            });
    }

    const getModalContent = () => {
        return (
            <div className="modal" style={ modalDisplay }>
                <div className="small-modal-content animate__animated animate__zoomIn">
                    <div>
                        <button onClick={ toggleModal } className="btn btn-outline-danger pb-0 pt-0 pl-2 pr-2">&times;</button>
                    </div>

                    <h5 className="text-center pt-4">{ modalMessage }</h5>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="row">
                <div className="col-md-6">
                    <h1>{ healthPro?.user?.first_name } { healthPro?.user?.last_name }</h1>
                </div>
                <div className="col-md-6">
                    <CancelButton returnUrl="/healthcare_professionals" style={ {float: 'right'} } />
                </div>
            </div>
            <button onClick={ softDelete } className="btn btn-outline-danger mt-3"> 
                { healthPro?.user?.is_active ? "Set inactive" : "Set active" }
            </button>
            <hr />
            <HpCalendar hpId={ id } />
            <h1> Assigned Service Requests </h1>
            { loadHPServs()}
            <hr />
            <HealthProInfo healthPro={ healthPro } />
            
            { getModalContent() }
        </div>
    );



}
export default HealthcareProDetail;
