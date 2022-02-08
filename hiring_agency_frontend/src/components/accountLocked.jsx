import React from 'react';

function AccountLocked() {
    return (
        <div className="text-center">
            <h1 className="text-danger">Your account is locked</h1>
            <span>Please contact the administrator to unlock your account</span>
        </div>
    );
}

export default AccountLocked;
