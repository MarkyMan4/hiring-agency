import React from "react";

function HealthProInfo({ healthPro }) {
    if(Object.keys(healthPro).length > 0){
        
    return (
        <div>
            <div className="col-md-8">
                <h1>Healthcare Professional Information</h1>
            </div>
            <hr/>
            <div className="row row-cols-1 row-cols-lg-2 align-items-stretch g-4 py-5">
                <div className="col" >
                    <p><b>Username: </b>{healthPro.user.username}</p>
                    <p><b>Name: </b>{ healthPro.user.first_name } { healthPro.user.last_name }</p>
                    <p><b>Gender: </b>{healthPro.gender}</p>
                    <p><b>Phone: </b>{healthPro.phone_number}</p>
                    <p><b>Email: </b>{ healthPro.email } </p>
                    <p><b>Address: </b>{ healthPro.address }</p>
                    <p><b>SSN: </b>{ healthPro.ssn } </p>
                </div>

                <div className="col" > 
                    <p><b>Graduate time: </b>{ healthPro.graduation_year}-{healthPro.graduation_month}</p>
                    <p><b>Education institution: </b>{ healthPro.education_institution } </p>
                    <p><b>Experience: </b>{ healthPro.years_of_experience} year(s) </p>
                    <p><b>Hourly rate: </b>{ healthPro.hourly_rate } </p>
                    <p><b>Status: </b>{ healthPro.user.is_active ? "Active" : "Inactive" }</p>
                    <p><b>Time of last login: </b>{ healthPro.user.last_login }</p>
                    <p><b>Time of join system: </b>{ healthPro.user.date_joined }</p>    
                </div>      
            </div>       
        </div>
        );
    }
    else{
        return(
            <div>
            <h1>Loading...</h1>
            </div>
        );    
    }
}

export default HealthProInfo;
