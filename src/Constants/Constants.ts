export default class Constants {
    public static readonly DEFAULT_PAGE_SIZE: number = 20;

    // Bộ giá trị
    static Status = {
        Active: true,
        Inactive: false
    };

    static FeatureCode = {
        AccommodationAmenity: 'AccommodationAmenity',
        RoomTypeAmenity: 'RoomTypeAmenity'
    };

    static AccommodationType = {
        Hotel: 1,
        Resort: 2,
        Homestay: 3
    };

    static ItemType = {
        Tour: 1,
        Accommodation: 2,
        Combo: 3
    };

    static TourDepartureStatus = {
        Available: 1,
        Full: 2,
        Cancelled: 3
    };

    static PriceLevel = {
        Budget: 1,
        Standard: 2,
        Premium: 3
    };

    static ServiceType = {
        Accomodation: 1,
        Tour: 2,
        Combo: 3
    };

    static VehicleType = {
        Car: 1,
        Plane: 2
    };

    static Gender = {
        Male: 1,
        Female: 2,
        Other: 3
    };

    // Options cho bộ lọc và các thành phần giao diện
    static StatusOptions = [
        { value: this.Status.Active, label: 'Hoạt động' },
        { value: this.Status.Inactive, label: 'Không hoạt động' }
    ];

    static AccommodationTypeOptions = [
        { value: this.AccommodationType.Hotel, label: 'Khách sạn' },
        { value: this.AccommodationType.Resort, label: 'Resort' },
        { value: this.AccommodationType.Homestay, label: 'Homestay' }
    ];

    static ServiceTypeOptions = [
        { value: this.ItemType.Accommodation, label: 'Cơ sở lưu trú' },
        { value: this.ItemType.Tour, label: 'Tour' },
        { value: this.ItemType.Combo, label: 'Combo' }
    ];

    // Color
    static StatusColor = [
        { value: this.Status.Active, label: 'green' },
        { value: this.Status.Inactive, label: 'red' }
    ];

    static ItemTypeOptions = [
        { value: this.ItemType.Tour, label: 'Tour' },
        { value: this.ItemType.Accommodation, label: 'Cơ sở lưu trú' },
        { value: this.ItemType.Combo, label: 'Combo' }
    ];

    static TourDepartureStatusOptions = [
        { value: this.TourDepartureStatus.Available, label: 'Còn chỗ' },
        { value: this.TourDepartureStatus.Full, label: 'Hết chỗ' },
        { value: this.TourDepartureStatus.Cancelled, label: 'Đã hủy' }
    ];

    static PriceLevelOptions = [
        { value: this.PriceLevel.Budget, label: 'Tiết kiệm' },
        { value: this.PriceLevel.Standard, label: 'Tiêu chuẩn' },
        { value: this.PriceLevel.Premium, label: 'Cao cấp' }
    ];

    static VehicleTypeOptions = [
        { value: this.VehicleType.Car, label: 'Xe ô tô' },
        { value: this.VehicleType.Plane, label: 'Máy bay' }
    ];

    static GenderOptions = [
        { value: this.Gender.Male, label: 'Nam' },
        { value: this.Gender.Female, label: 'Nữ' },
        { value: this.Gender.Other, label: 'Khác' }
    ];

    public static readonly DEFAULT_LIST_ITEM_PAGE_SIZE: number = 10;
    // Guest and Room Limits
    static GuestLimits = {
        MIN_ADULTS: 1,
        MAX_GUESTS: 10,
        MIN_CHILDREN: 0,
        MIN_ROOMS: 1,
        MAX_ROOMS: 10
    };
}
