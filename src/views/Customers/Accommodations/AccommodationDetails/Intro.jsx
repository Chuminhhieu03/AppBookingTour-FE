import React from 'react';

function Intro({ accommodation }) {
    return (
        <div style={{ height: '300px' }}>
            <h4 className="fw-bold mb-3">GIỚI THIỆU</h4>

            <p className="text-secondary border rounded p-4" style={{ overflowY: 'scroll' }}>
                {accommodation?.description}
            </p>
        </div>
    );
}

export default Intro;
