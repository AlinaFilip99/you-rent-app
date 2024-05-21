interface ISearchCriteria extends IBaseObject {
    priceMin: number;
    priceMax: number;
    country: string;
    city: string;
    bedrooms: number;
    bathrooms?: number;
    habitableArea?: number;
    zip?: string;
    heetingType?: number;
    constructionYear?: number;
    hasPrivateParking?: boolean;
    hasExtraStorage?: boolean;
}
