import BasePaginationFilter from "DTO/BasePaginationFilter";
import DiscountFilter from "./SearchDiscountFilter";

 export default class SearchDiscountQuery extends BasePaginationFilter {
    public Filter?: DiscountFilter;
}