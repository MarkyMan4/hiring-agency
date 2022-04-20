import React from "react";
import { useNavigate } from "react-router-dom";

// this button can be used to return to a previous page
// return URL is the page the user should be directed to when cancel is clicked
// style is an object for a custom style you want to apply (e.g. { float: 'right' })
function CancelButton({ returnUrl, style={} }) {
    let navigate = useNavigate();

    const cancel = () => {
        navigate(returnUrl);
    }

    return (
        <button onClick={ cancel } className="btn btn-outline-primary m-1" style={ style }>Cancel</button>
    );
}

export default CancelButton;
