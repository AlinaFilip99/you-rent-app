import { GeoPoint } from 'firebase/firestore';

export default interface IEstate extends IBaseObject {
    name: string;
    price: number;
    isActive: boolean;
    userId: string;
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
    heetingType?: number;
    constructionYear?: number;
    hasPrivateParking?: boolean;
    hasExtraStorage?: boolean;
    pictureUrls?: string[];
    coordinates?: GeoPoint;
}
