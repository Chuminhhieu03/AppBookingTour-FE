import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AccommodationTitle from './AccommodationTitle';
import Gallery from './Gallery';
import Intro from './Intro';
import Location from './Location';
import Facilities from './Facilities';
import RoomCard from './RoomCard';
import Policy from './Policy';
import accommodationAPI from '../../../../api/accommodation/accommodationAPI';
import LoadingModal from '../../../../components/LoadingModal';

function AccommodationDetail() {
    const [accommodation, setAccommodation] = useState({});
    const { id } = useParams();

    useEffect(() => {
        getAccommodationById();
    }, []);

    const getAccommodationById = async () => {
        try {
            LoadingModal.showLoading();
            const res = await accommodationAPI.getById(id);
            setAccommodation(res.accommodation ?? {});
        } catch (error) {
            console.error('Error fetching accommodation details:', error);
        } finally {
            LoadingModal.hideLoading();
        }
    };
 
    return (
        <div className="container mt-4">
            <AccommodationTitle accommodation={accommodation} />

            <Gallery images={accommodation.listInfoImage} />

            <div className="row mt-4">
                <div className="col-md-6">
                    <Intro accommodation={accommodation} />
                </div>
                <div className="col-md-6">
                    <Location accommodation={accommodation} />
                </div>
            </div>

            <Facilities accommodation={accommodation} />

            {accommodation.listRoomType?.map((roomType) => (
                <RoomCard key={roomType.id} roomType={roomType} />
            ))}

            <Policy accommodation={accommodation} />
        </div>
    );
}

export default AccommodationDetail;
