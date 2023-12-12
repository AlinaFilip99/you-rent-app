import { GeoPoint } from 'firebase/firestore';
import IEstate from '../interfaces/api/IEstate';

export const capitalize = (str = '') => {
    return `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
};

export const formatISODateTime = (date: moment.Moment) => {
    return date.format('YYYY-MM-DDTHH:mm:ss');
};

export const setTabBarVisibility = () => {
    let tabsVisible = false;
    switch (window.location.pathname) {
        case '/estates':
            tabsVisible = true;
            break;

        default:
            break;
    }
    const tabBar = document.getElementById('app-tab-bar');
    if (tabBar !== null) {
        tabBar.style.display = tabsVisible ? 'flex' : 'none';
    }
};

export const showTabBar = (): void => {
    const tabBar = document.getElementById('app-tab-bar');
    if (tabBar !== null) {
        tabBar.style.display = 'flex';
    }
};

export const hideTabBar = (): void => {
    const tabBar = document.getElementById('app-tab-bar');
    if (tabBar !== null) {
        tabBar.style.display = 'none';
    }
};

const ToAddressLine1 = (street?: string, number?: string, addressExtra?: string) => {
    let address = '';

    if (number && number !== '') {
        address += capitalize(number);
    }

    if (street && street !== '') {
        if (address.length) {
            address += ' ';
        }

        address += capitalize(street);
    }

    if (addressExtra && addressExtra !== '') {
        if (address.length) {
            address += ', ';
        }

        address += capitalize(addressExtra);
    }

    return address;
};

const ToAddressLine2 = (city: string, country: string, region?: string, zip?: string) => {
    let address = '';

    if (city && city !== '') {
        address += capitalize(city);
    }

    if (region && region !== '') {
        if (address.length) {
            address += ', ';
        }

        address += capitalize(region);
    }

    if (zip && zip !== '') {
        if (address.length) {
            address += ' ';
        }

        address += capitalize(zip);
    }

    if (country && country !== '') {
        if (address.length) {
            address += ', ';
        }

        address += capitalize(country);
    }

    return address;
};

export const ToFullAddress = (
    country: string,
    city: string,
    zip?: string,
    street?: string,
    number?: string,
    region?: string,
    addressExtra?: string
) => {
    let address = '';

    let address1 = ToAddressLine1(street, number, addressExtra);

    if (address1 !== '') {
        address += address1;
    }
    let address2 = ToAddressLine2(city, country, region, zip);

    if (address2 !== '') {
        if (address.length) {
            address += ', ';
        }
        address += address2;
    }

    return address;
};

export const cleanData = (data: IEstate, replaceValue?: any) => {
    let cleanData: { [key: string]: number | string | boolean | undefined | string[] | GeoPoint } = { ...data };
    Object.keys(cleanData).forEach((key) => {
        if (!cleanData[key]) {
            if (!replaceValue) {
                delete cleanData[key];
            } else {
                cleanData[key] = replaceValue;
            }
        }
    });
    return cleanData;
};
