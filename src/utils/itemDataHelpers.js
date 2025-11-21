import Constants from '../Constants/Constants';
import Utility from './Utility';

// Format duration for tours and combos
export const formatDuration = (durationDays, durationNights) => {
    if (durationDays && durationNights) {
        return `${durationDays} ngày ${durationNights} đêm`;
    } else if (durationDays) {
        return Utility.formatDuration(durationDays);
    }
    return 'N/A';
};

// Filter helper functions
export const createEmptyFilter = (type) => {
    const baseFilter = {
        priceFrom: null,
        priceTo: null
    };

    switch (type) {
        case 'accommodation':
            return {
                ...baseFilter,
                cityId: null,
                starRating: null,
                accommodationType: null,
                checkInDate: null,
                checkOutDate: null,
                numOfAdult: 1,
                numOfChild: 0,
                numOfRoom: 1
            };

        case 'tour':
            return {
                ...baseFilter,
                departureCityId: null,
                destinationCityId: null,
                tourTypeId: null,
                tourCategoryId: null,
                departureDate: null
            };

        case 'combo':
            return {
                ...baseFilter,
                departureCityId: null,
                destinationCityId: null,
                vehicle: null,
                departureDate: null
            };

        default:
            return baseFilter;
    }
};

// URL parameter helpers
export const buildUrlParams = (filters) => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
            params.set(key, value.toString());
        }
    });

    return params;
};

export const parseUrlParams = (searchParams) => {
    const filters = {};

    for (const [key, value] of searchParams.entries()) {
        // Skip pagination and sorting params - these don't belong in filter
        if (['page', 'pageSize', 'sort'].includes(key)) {
            continue;
        }

        // Convert numeric values
        if (
            [
                'priceFrom',
                'priceTo',
                'cityId',
                'departureCityId',
                'destinationCityId',
                'tourTypeId',
                'tourCategoryId',
                'starRating',
                'vehicle',
                'numOfAdult',
                'numOfChild',
                'numOfRoom'
            ].includes(key)
        ) {
            filters[key] = Number(value);
        } else {
            filters[key] = value;
        }
    }

    return filters;
};
