import BaseEntity from './BaseEntity';

export default class Discount extends BaseEntity {
    public Code?: string;
    public StartEffectedDtg?: Date;
    public EndEffectedDtg?: Date;
    public Name?: string;
    public DiscountPercent?: number;
    public TotalQuantity?: number;
    public RemainQuantity?: number;
    public ServiceType?: number;
    public Status?: number;
    public Description?: string;
}
