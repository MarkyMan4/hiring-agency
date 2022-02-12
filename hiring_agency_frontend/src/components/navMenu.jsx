import React, { useEffect, useState } from "react";
import { Nav, Navbar} from 'react-bootstrap';
import { isUserLoggedIn, destroyAuthToken, getAuthToken, isAdmin } from "../utils/storage";
import { getUser, logout } from "../api/authRequests";
import AddStaff from "./addStaff";

function NavMenu() {
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

    const createJobPosting = () => {
        if(isUserLoggedIn()) { 
            return <Nav.Link className="nav-link" href="#/create_job" >Create Job Advertisement</Nav.Link>
        }
    }

    const getAddStaff = () => {
        if(isAdmin()) {
            return <Nav.Link className="nav-link" href="#/add_new_staff" >Add staff</Nav.Link>
        }
    }

    const getUserNameOrBlank = () => {
        if(isUserLoggedIn()) {
            return getUser(getAuthToken())
                .then(res => <div>{res.username}</div>)
                .catch(err => console.log(err));
        }
        else {
            return <div></div>;
        }
    }

    return (
        <Navbar className="navbar-dark mb-5 py-2 site-navbar" bg="dark" expand="lg">
            <Navbar.Brand href="#/" className="ml-5">Cowley Hiring Agency</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link className="nav-link" href="#/">Home</Nav.Link>
                    <Nav.Link className="nav-link" href="#/caretaker_acct_request">Sign Up</Nav.Link>
                    { getAddStaff() }
                    { createJobPosting()}
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
