import React from 'react';
import { Rate } from 'antd';
import { EnvironmentOutlined } from '@ant-design/icons';

function AccommodationTitle({ accommodation }) {
    return (
        <div className="mt-3">
            <div className="text-secondary small mb-2">
                Khách sạn / Khách sạn {accommodation?.city?.name} /
                <span className="text-primary fw-semibold">&nbsp;Đặt phòng {accommodation?.name}</span>
            </div>

            <h3 className="fw-bold">{accommodation?.name}</h3>

            <div className="d-flex align-items-center mt-2">
                <Rate disabled value={accommodation?.starRating} />
            </div>

            <div className="mt-2 text-secondary d-flex align-items-center">
                <EnvironmentOutlined />
                <span className="ms-2">{accommodation?.address}, {accommodation?.city?.name}</span>
            </div>
        </div>
    );
}

export default AccommodationTitle;
