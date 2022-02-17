import React, { useEffect, useState } from "react";
import { Nav, Navbar} from 'react-bootstrap';
import { isUserLoggedIn, destroyAuthToken, getAuthToken, isAdmin } from "../utils/storage";
import { getUser, logout } from "../api/authRequests";
import AddStaff from "./addStaff";

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
            return <Nav.Link className="nav-link" href="#/" onClick={ logoutAndDestroyToken }>Logout</Nav.Link>
        }
        else {
            return <Nav.Link className="nav-link" href="#/login">Login</Nav.Link>
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

    const getAddStaff = () => {
        if(roles.includes('admin')) {
            return <Nav.Link className="nav-link" href="#/add_new_staff" >Add staff</Nav.Link>
        }
    }

    const getCareTakerAccountRequest = () => {
        console.log(roles);
        if(roles.includes('admin') || roles.includes('staff')) { 
            return <Nav.Link className="nav-link" href="#/pending_caretaker_requests">Care Taker Account Requests</Nav.Link>
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
                    { getAddStaff() }
                    { createJobPosting() }
                    { getCareTakerAccountRequest() }
                    { getLoginOrLogoutButton() }
                </Nav>
            </Navbar.Collapse>
            <span className="navbar-text mr-5">
                { username }
            </span>
        </Navbar>
    )
}

export default NavMenu;
