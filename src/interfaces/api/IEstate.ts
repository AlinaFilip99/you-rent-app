interface IEstate extends IBaseObject {
    name: string;
    price: number;
    isActive: boolean;
    userId: number;
    country: string;
    city: string;
    bedrooms: number;
    bathrooms: number;
    habitableArea: number;
    score?: number;
    description?: string;
    zip?: string;
    street?: string;
    number?: string;
    region?: string;
    addressExtra?: string;
    heetingType?: string;
    constructionYear?: string;
    hasPrivateParking?: boolean;
    hasExtraStorage?: boolean;
}
