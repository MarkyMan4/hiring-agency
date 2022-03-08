import React, { useEffect, useState } from "react";
import { Nav, Navbar, NavDropdown} from 'react-bootstrap';
import { isUserLoggedIn, destroyAuthToken, getAuthToken, isAdmin } from "../utils/storage";
import { getUser, logout } from "../api/authRequests";


function NavMenu({ roles }) {
    const [username, setUsername] = useState('');

    useEffect(() => {
        if(isUserLoggedIn()) {
            getUser(getAuthToken())
                .then(res => setUsername(res.username))
                .catch(err => console.log(err));
        }
        else {
            setUsername('');
        }

    }, [localStorage.getItem('token')]);

    const logoutAndDestroyToken = () => {
        logout(); // no need to do anything with return val since there is no response
        destroyAuthToken();
        window.location.reload();
    }

    const getLoginOrLogoutButton = () => {
        if(isUserLoggedIn()) {
            return <Nav.Link className="nav-link btn btn-outline-success" href="#/" onClick={ logoutAndDestroyToken }>Logout</Nav.Link>
        }
        else {
            return <Nav.Link className="nav-link btn btn-outline-success" href="#/login">Login</Nav.Link>
        }
    }

    const getSignUp = () => {
        if(roles.length === 0) {
            return <Nav.Link className="nav-link" href="#/caretaker_acct_request">Sign Up</Nav.Link>
        }
    }

    const createJobPosting = () => {
        if(roles.includes('admin') || roles.includes('staff')) { 
            return <Nav.Link className="nav-link" href="#/create_job" >Create Job Advertisement</Nav.Link>
        }
    }

    const viewJobPosting = () => {
        if(roles.length === 0) {
            return <Nav.Link className="nav-link" href="#/view_job" >Careers</Nav.Link>
        }
    }
    const viewJobRequest = () => {
        if(roles.includes('admin') || roles.includes('staff')) { 
            return <Nav.Link className="nav-link" href="#/hp_job_application">Job Requests</Nav.Link>
        }
    }

    const viewStaffList = () => {
        if(roles.includes('admin') ) { 
            return <NavDropdown.Item className="nav-link" href="#/view_staff_list">Staff List</NavDropdown.Item>
        }
    }

    const viewCareTakerList = () => {
        if(roles.includes('admin') || roles.includes('staff')) { 
            return <NavDropdown.Item className="nav-link" href="#/view_caretaker_list">Care taker List</NavDropdown.Item>
        }
    }


    const getAddStaff = () => {
        if(roles.includes('admin')) {
            return <NavDropdown.Item className="nav-link" href="#/add_new_staff" >Add staff</NavDropdown.Item>
        }
    }

    const getCareTakerAccountRequest = () => {
        if(roles.includes('admin') || roles.includes('staff')) { 
            return <Nav.Link className="nav-link" href="#/pending_caretaker_requests">Care Taker Account Requests</Nav.Link>
        }
    }

    const getCreateServiceRequest = () => {
        if(roles.includes('admin') || roles.includes('caretaker')) { 
            return <Nav.Link className="nav-link" href="#/create_service_request">New Service Request</Nav.Link>
        }
    }

    const getServiceRequests = () => {
        if(roles.includes('admin') || roles.includes('staff')) { 
            return <Nav.Link className="nav-link" href="#/service_requests">Service Requests</Nav.Link>
        }
    }
    const userChangePassword = () =>{
        if(isUserLoggedIn()) {
            return <Nav.Link className="nav-link" href="#/user_menu">{ username } </Nav.Link>
        }
    }
    

    const getBillingAccounts = () => {
        if(roles.includes('admin') || roles.includes('staff')) { 
            return <Nav.Link className="nav-link" href="#/billing_accounts">Billing Accounts</Nav.Link>
        }
    }

    return (
        <Navbar className="navbar-dark mb-5 py-2 site-navbar" bg="dark" expand="lg">
            <Navbar.Brand href="#/" className="ml-5">Cowley Hiring Agency</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link className="nav-link" href="#/">Home</Nav.Link>
                    { getSignUp() }
                    <NavDropdown
                        id="nav-dropdown-dark-example"
                        title="User management"
                        menuVariant="dark"
                        >
                        { getAddStaff() }
                        { viewStaffList() }
                        { viewCareTakerList() }
                    </NavDropdown>
                    { createJobPosting() }
                    { getCareTakerAccountRequest() }
                    { viewJobPosting() }
                    { viewJobRequest() }
                    { getCreateServiceRequest() }
                    { getServiceRequests() }
                    { getBillingAccounts() }
                </Nav>
            </Navbar.Collapse>
            <span className="navbar-text" style={ {marginRight: '20px'} }>
                { userChangePassword() }
            </span>
            <span className="navbar-text">
                { getLoginOrLogoutButton() }
            </span>
        </Navbar>
    )
}

export default NavMenu;
