interface IEstateFilterValues {
    minScore?: number;
    price?: IRange;
    bedrooms?: IRange;
    bathrooms?: IRange;
    habitableSurface?: IRange;
    constructionYear?: IRange;
    includeParking?: boolean;
    includeStorage?: boolean;
    withPictures?: boolean;
}
