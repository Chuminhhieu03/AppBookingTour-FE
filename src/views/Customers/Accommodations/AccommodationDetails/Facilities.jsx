import React from 'react';
import { CheckCircleFilled, CheckOutlined } from '@ant-design/icons';

function Facilities({ accommodation }) {
    // Parse amenityName string, split by comma, trim and filter empty strings
    const amenities = accommodation?.amenityName
        ? accommodation.amenityName
              .split(',')
              .map((item) => item.trim())
              .filter((item) => item.length > 0)
        : [];

    if (amenities.length === 0) {
        return null;
    }

    return (
        <div className="mt-5">
            <h3 className="text-center fw-bold mb-4">TIỆN NGHI CHỖ Ở</h3>
            <div className="row text-center border rounded p-4">
                {amenities.map((amenity, index) => (
                    <div key={index} className="col-md-3 mb-3">
                        <CheckOutlined style={{ fontSize: '24px', color: '#52c41a' }} />
                        <div className="mt-2">{amenity}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Facilities;
