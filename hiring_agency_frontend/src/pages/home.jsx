import React from "react";

    const topI = require( '../images/home1.jpeg');
    const nurseI = require("../images/nurse.jpg")
    const phyI = require("../images/Physiotherapist.jpg")
    const psyI = require("../images/Psychiatrists.jpg")

function Home() {
    return (
        <div>
            
            <div><img  class="d-block mx-lg-auto img-fluid" src={topI} alt= "../images/home2.jpeg" width="1710" height="300" loading="lazy"></img></div>
            <br/>
            <div class="pricing-header p-3 pb-md-4 mx-auto text-center">
                <h1>Our Services</h1>
                <p class="fs-5 text-muted">Three different types healthcare professional can match all kinds of needs</p>
            </div>
            
            <div class="container col-xxl-8 ">
                <div class="row flex-lg-row-reverse align-items-center g-5 py-5">
                    <div class="col-10 col-sm-8 col-lg-6">
                        <img src={nurseI} alt= "../images/nurse.jpg" class="d-block mx-lg-auto img-fluid"  width="1000" height="700" loading="lazy"></img>
                    </div>
                    <div class="col-lg-6">
                        <h1 class="display-5 fw-bold lh-1 mb-3">Nurse service</h1>
                        <h1 class="card-title pricing-card-title">$40<small class="text-muted fw-light">/hour</small></h1>
                        <p class="lead">Health services for your patient</p>
                    </div>
                </div>
            </div>
            <div class="b-example-divider"></div>

            <div class="container col-xxl-8 ">
                <div class="row flex-lg-row-reverse align-items-center g-5 py-5">
                    <div class="col-10 col-sm-8 col-lg-6">
                        <img src={phyI} alt= "../images/nurse.jpg" class="d-block mx-lg-auto img-fluid"  width="1000" height="700" loading="lazy"></img>
                    </div>
                    <div class="col-lg-6">
                        <h1 class="display-5 fw-bold lh-1 mb-3">Physiotherapist</h1>
                        <h1 class="card-title pricing-card-title">$50<small class="text-muted fw-light">/hour</small></h1>
                        <p class="lead">Physical therapy services</p>
                    </div>
                </div>
            </div>
            <div class="b-example-divider"></div>
            <div class="container col-xxl-8 px-4 py-5">
                <div class="row flex-lg-row-reverse align-items-center g-5 py-5">
                    <div class="col-10 col-sm-8 col-lg-6">
                        <img src={psyI} alt= "../images/nurse.jpg" class="d-block mx-lg-auto img-fluid"  width="1000" height="700" loading="lazy"></img>
                    </div>
                    <div class="col-lg-6">
                        <h1 class="display-5 fw-bold lh-1 mb-3">Psychiatrists</h1>
                        <h1 class="card-title pricing-card-title">$60<small class="text-muted fw-light">/hour</small></h1>
                        <p class="lead">Mental health services</p>
                    </div>
                </div>
            </div>
            <div class="b-example-divider"></div>
            
            
            <div class="pricing-header p-3 pb-md-4 mx-auto text-center">
                <br/>
                <br/>
                <br/>
                <h1>Our features</h1>
                <p class="fs-5 text-muted">We provide customized services to fit your needs</p>
            </div>
            <div class="row row-cols-1 row-cols-md-3 mb-3 text-center">
                <div class="col">
                    <div class="card mb-4 rounded-3 shadow-sm border-info">
                    <div class="card-header py-3 text-white bg-info border-info">
                        <h4 class="my-0 fw-normal">Regular service</h4>
                    </div>
                    <div class="card-body">
                        <ul class="list-unstyled mt-3 mb-4">
                        <li>Any day of the week</li>
                        <li>Choose start and end times of service</li>
                        <li>Healthcare professional will arrive on time</li>
                        <br />
                        </ul>
                    </div>
                    </div>
                </div>
                <div class="col">
                    <div class="card mb-4 rounded-3 shadow-sm border-primary">
                    <div class="card-header py-3 text-white bg-primary border-primary">
                        <h4 class="my-0 fw-normal">Flexible hours</h4>
                    </div>
                    <div class="card-body">
                        <ul class="list-unstyled mt-3 mb-4">
                        <li>Any day of the week</li>
                        <li>Choose how many hours of service are needed</li>
                        <li>We can help at anytime</li>
                        <br />
                        </ul>
                    </div>
                    </div>
                </div>
                <div class="col">
                    <div class="card mb-4 rounded-3 shadow-sm border-warning">
                    <div class="card-header py-3 text-white bg-warning border-warning">
                        <h4 class="my-0 fw-normal">Special request</h4>
                    </div>
                    <div class="card-body">
                        <ul class="list-unstyled mt-3 mb-4">
                        <li></li>
                        <li>Specify required gender of healthcare professional</li>
                        <li></li><br />
                        <li>Specify minimum and maximum ages of healthcare professionals</li>
                        <br/>
                        </ul>
                    </div>
                    </div>
                </div>
                </div>
                <br/>
                <div class="pricing-header p-3 pb-md-4 mx-auto text-center">
                <h1>Want to join us?</h1>
                <br/>
                <p class="fs-5 text-muted">Check our job advertisements on the website, apply to a suitable job for you and start working now!</p>
                <p class="fs-5 text-muted">We are looking forward to working with you!</p>
                <br/>
                <br/>
                <br/>
                <br/>
            </div>
        </div>
        
    );
}

export default Home;
