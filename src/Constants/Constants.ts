export default class Constants {
    public static readonly DEFAULT_PAGE_SIZE: number = 20;
    
    // Bộ giá trị
    static Status = {
        Active: true,
        Inactive: false
    };

    static FeatureCode = {
        AccommodationAmenity: 'AccommodationAmenity'
    }

    // Options cho bộ lọc và các thành phần giao diện
    static StatusOptions = [
        { value: this.Status.Active, label: 'Hoạt động' },
        { value: this.Status.Inactive, label: 'Không hoạt động' }
    ];
}
