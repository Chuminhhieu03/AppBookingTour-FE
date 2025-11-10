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
    }

    static AccommodationType = {
        Hotel: 1,
        Resort: 2,
        Homestay: 3
    }

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
    
    // Color
    static StatusColor = [
        { value: this.Status.Active, label: 'green' },
        { value: this.Status.Inactive, label: 'red' }
    ];
}
