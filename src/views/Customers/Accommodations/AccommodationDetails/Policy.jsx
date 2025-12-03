import React from 'react';

function Policy({ accommodation }) {
    if (!accommodation?.regulation) {
        return null;
    }

    return (
        <div className="my-5">
            <h3 className="fw-bold text-center mb-4">QUY ĐỊNH CHỖ NGHỈ</h3>
            <div className="border rounded p-4">
                <div dangerouslySetInnerHTML={{ __html: accommodation.regulation }} />
            </div>
        </div>
    );
}

export default Policy;
