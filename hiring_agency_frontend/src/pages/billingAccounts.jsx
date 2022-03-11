import React, { useEffect, useState } from "react";
import { getAllBillingAccounts } from "../api/billingAccounts";
import { getAuthToken } from "../utils/storage";
import BillingAccountCard from "../components/billingAccountCard";

function BillingAccounts() {
    const [billingAccts, setBillingAccts] = useState();

    useEffect(() => {
        getAllBillingAccounts(getAuthToken())
            .then(res => setBillingAccts(res));
    }, []);

    const getBillingAccountsOrEmpty = () => {
        if(billingAccts?.length === 0) {
            return (
                <h3 className="text-center">There are no billing accounts</h3>
            );
        }
        else {
            return (
                <div>
                    { billingAccts?.map(ba => {
                        return (
                            <BillingAccountCard
                                key={ ba.id }
                                acctId={ ba.id }
                                patientName={ ba.service_request.patient_first_name + ' ' + ba.service_request.patient_last_name }
                                amtPaid={ ba.amt_paid }
                                amtToBePaid={ ba.amt_to_be_paid }
                            />
                        )
                    })}
                </div>
            );
        }
    }

    return (
        <div className="row">
            <h1 className="text-center mb-5">Billing accounts</h1>
            <div className="col-md-3"></div>
            <div className="col-md-6">
                { getBillingAccountsOrEmpty() }
            </div>
        </div>
    );
}

export default BillingAccounts;
