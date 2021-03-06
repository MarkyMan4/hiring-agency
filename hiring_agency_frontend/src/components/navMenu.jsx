import React, { useEffect, useState } from "react";
import { Nav, Navbar, NavDropdown} from 'react-bootstrap';
import { isUserLoggedIn, destroyAuthToken, getAuthToken } from "../utils/storage";
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
            return <NavDropdown.Item className="nav-link" href="#/create_job" >Create Job Advertisement</NavDropdown.Item>
        }
    }

    const viewJobPosting = () => {
        if(roles.length === 0) {
            return <Nav.Link className="nav-link" href="#/view_job" >Careers</Nav.Link>
        }
    }
    const viewJobRequest = () => {
        if(roles.includes('admin') || roles.includes('staff')) { 
            return <NavDropdown.Item className="nav-link" href="#/hp_job_application">Job Requests</NavDropdown.Item>
        }
    }

    const viewStaffList = () => {
        if(roles.includes('admin') ) { 
            return <NavDropdown.Item className="nav-link" href="#/view_staff_list">Staff</NavDropdown.Item>
        }
    }

    const viewCareTakerList = () => {
        if(roles.includes('admin') || roles.includes('staff')) { 
            return <NavDropdown.Item className="nav-link" href="#/view_caretaker_list">Care takers</NavDropdown.Item>
        }
    }

    const getAddStaff = () => {
        if(roles.includes('admin')) {
            return <NavDropdown.Item className="nav-link" href="#/add_new_staff" >Add staff</NavDropdown.Item>
        }
    }

    const getLockedUser = () => {
        if(roles.includes('admin')) {
            return <NavDropdown.Item className="nav-link" href="#/locked_user_list" >Locked Users</NavDropdown.Item>
        }
    }

    const getHealthCareProfessionals = () => {
        if(roles.includes('admin') || roles.includes('staff')) { 
            return <NavDropdown.Item className="nav-link" href="#/healthcare_professionals">Healthcare Professionals</NavDropdown.Item>
        }
    }

    const getPayroll = () => {
        if(roles.includes('admin') || roles.includes('staff')) { 
            return <NavDropdown.Item className="nav-link" href="#/payroll">Payroll</NavDropdown.Item>
        }
    }

    const getUserManagement = () => {
        if(roles.includes('admin') || roles.includes('staff')) { 
            return (
                <NavDropdown
                    id="nav-dropdown-dark-example"
                    title="User management"
                    menuVariant="dark"
                    >
                    { getAddStaff() }
                    { viewStaffList() }
                    { viewCareTakerList() }
                    { getCareTakerAccountRequest() }
                    { getHealthCareProfessionals() }
                    { getLockedUser() }
                    { getPayroll() }
                </NavDropdown>
            );
        }
    }

    const getCareTakerAccountRequest = () => {
        if(roles.includes('admin') || roles.includes('staff')) { 
            return <NavDropdown.Item className="nav-link" href="#/pending_caretaker_requests">Care Taker Account Requests</NavDropdown.Item>
        }
    }

    const getCreateServiceRequest = () => {
        if(roles.includes('admin') || roles.includes('caretaker')) { 
            return <NavDropdown.Item className="nav-link" href="#/create_service_request">New Service Request</NavDropdown.Item>
        }
    }

    const getCareTakerServiceRequests = () => {
        if(roles.includes('admin') || roles.includes('caretaker')) { 
            return <NavDropdown.Item className="nav-link" href="#/caretaker_view_service_request">View Service Requests</NavDropdown.Item>
        }
    }

    const getServiceRequests = () => {
        if(roles.includes('admin') || roles.includes('staff')) { 
            return <NavDropdown.Item className="nav-link" href="#/service_requests">All Service Requests</NavDropdown.Item>
        }
    }
    const userChangePassword = () =>{
        if(isUserLoggedIn()) {
            return <Nav.Link className="nav-link" href="#/user_menu">{ username } </Nav.Link>
        }
    }
    
    const getBillingAccounts = () => {
        if(roles.includes('admin') || roles.includes('staff') || roles.includes('caretaker')) { 
            return <NavDropdown.Item className="nav-link" href="#/billing_accounts">Billing Accounts</NavDropdown.Item>
        }
    }

    const getJobManagement = () => {
        if(roles.includes('admin') || roles.includes('staff')) { 
            return (
                <NavDropdown
                    id="nav1-dropdown-dark-example"
                    title="Job management"
                    menuVariant="dark"
                    >
                    { createJobPosting() }
                    { viewJobRequest() }
                </NavDropdown>
            );
        }
    }

    const getCreateServiceEntry = () => {
        if(roles.includes('admin') || roles.includes('healthcareprofessional')) { 
            return <NavDropdown.Item className="nav-link" href="#/enter_service">Enter Hours Worked</NavDropdown.Item>
        }
    }

    const getServiceManagement = () => {
        if(roles.includes('admin') || roles.includes('staff') || roles.includes('caretaker') || roles.includes('healthcareprofessional')) { 
            return (
                <NavDropdown
                    id="nav2-dropdown-dark-example"
                    title="Service management"
                    menuVariant="dark"
                    >
                    { getCreateServiceRequest() }
                    { getServiceRequests() }
                    { getBillingAccounts() }
                    { getCareTakerServiceRequests()}
                    { getCreateServiceEntry() }
                </NavDropdown>
            );
        }
    }

    const getHPSchedule = () =>{
        if(roles.includes('healthcareprofessional') && !roles.includes('admin')) {
            return <Nav.Link className="nav-link" href="#/healthcare_professional_personal">{"My Schedule"} </Nav.Link>
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
                    { getUserManagement() }
                    { getJobManagement() }
                    { viewJobPosting() }
                    { getServiceManagement() }
                </Nav>
            </Navbar.Collapse>
            <span className="navbar-text" style={ {marginRight: '20px'} } >
                { getHPSchedule() }
            </span>
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
