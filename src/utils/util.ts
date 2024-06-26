import { GeoPoint } from 'firebase/firestore';
import { HeetingType } from './enums';
import IEstate from '../interfaces/api/IEstate';
import { getRequestsBySenderId } from '../services/request';
import userProfile from '../services/userProfile';

export const isMobile = (): boolean => {
    let userAgent = navigator.userAgent;
    if (userAgent == null || userAgent.length === 0) {
        return false;
    }

    let b =
        /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(
            userAgent
        );
    let v =
        /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw-(n|u)|c55\/|capi|ccwa|cdm-|cell|chtm|cldc|cmd-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc-s|devi|dica|dmob|do(c|p)o|ds(12|-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(-|_)|g1 u|g560|gene|gf-5|g-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd-(m|p|t)|hei-|hi(pt|ta)|hp( i|ip)|hs-c|ht(c(-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i-(20|go|ma)|i230|iac( |-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|-[a-w])|libw|lynx|m1-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|-([1-8]|c))|phil|pire|pl(ay|uc)|pn-2|po(ck|rt|se)|prox|psio|pt-g|qa-a|qc(07|12|21|32|60|-[2-7]|i-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h-|oo|p-)|sdk\/|se(c(-|0|1)|47|mc|nd|ri)|sgh-|shar|sie(-|m)|sk-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h-|v-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl-|tdg-|tel(i|m)|tim-|t-mo|to(pl|sh)|ts(70|m-|m3|m5)|tx-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas-|your|zeto|zte-/i.test(
            userAgent.substr(0, 4)
        );

    if (b || v) {
        return true;
    }

    return false;
};

export const isIOS = () => /iPad|iPhone|iPod/.test(navigator.userAgent);

export const capitalize = (str = '') => {
    return `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
};

export const formatISODateTime = (date: moment.Moment) => {
    return date.format('YYYY-MM-DDTHH:mm:ss');
};

export const formatDateTime = (date: moment.Moment) => {
    return date.format('DD/MM/YYYY HH:mm');
};

export const setTabBarVisibility = () => {
    let tabsVisible = false;
    switch (window.location.pathname) {
        case '/estates':
            tabsVisible = true;
            break;
        case '/user':
            tabsVisible = true;
            break;
        case '/requests':
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

export const cleanData = (
    data: IEstate | IUser | IComment | IRequest | IRequestMessage | ISearchCriteria,
    replaceValue?: any
) => {
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

export const getExistingRequest = async (senderId: string, receiverId: string) => {
    let response,
        sentRequests = await getRequestsBySenderId(userProfile.UserId);

    if (sentRequests?.length > 0) {
        let existingRequest = sentRequests.find((x) => x.senderId === senderId && x.receiverId === receiverId);
        if (existingRequest) {
            response = existingRequest;
        }
    }

    return response;
};

export const getSearchCriteriaUserFriendlyDescription = (searchCriterias?: ISearchCriteria[]) => {
    if (!searchCriterias) {
        return [];
    }

    const HeetingTypesValues: { [key: number]: string } = {
        [HeetingType.UnderfloorHeating]: 'Underfloor heating',
        [HeetingType.Radiators]: 'Radiators',
        [HeetingType.GasFurnace]: 'Gas furnace',
        [HeetingType.HeatPump]: 'Heat pump',
        [HeetingType.WallHeaters]: 'Wall heaters',
        [HeetingType.BaseboardHeaters]: 'Baseboard heaters',
        [HeetingType.Furnace]: 'Furnace'
    };

    let formattedCriterias = [];

    for (let criteria of searchCriterias) {
        let parts = [];
        parts.push(`wants to <strong>rent</strong> a property in ${criteria.city} ${criteria.country}`);

        let price = `with price between <strong>${criteria.priceMin + ' €'}</strong> and <strong>${
            criteria.priceMax + ' €'
        }</strong>`;
        if (parts) {
            parts.push(price);
        }
        if (criteria.habitableArea) {
            parts.push(`with area from <strong>${criteria.habitableArea} m2</strong>`);
        }
        let features = [];
        if (criteria.bedrooms) {
            features.push(`${criteria.bedrooms} rooms`);
        }
        if (criteria.bathrooms) {
            features.push(`${criteria.bathrooms} bathrooms`);
        }
        if (criteria.hasPrivateParking) {
            features.push('private parking');
        }
        if (criteria.hasExtraStorage) {
            features.push('extra storage');
        }
        if (features.length > 0) {
            parts.push(`with ${features.join(', ')}`);
        }
        if (criteria.heetingType) {
            parts.push(`with heeting through ${HeetingTypesValues[criteria.heetingType].toLowerCase()}`);
        }
        if (criteria.constructionYear) {
            parts.push(`built after ${criteria.constructionYear}`);
        }
        if (criteria.zip) {
            parts.push(`in zip code <strong>${criteria.zip}</strong>`);
        }

        formattedCriterias.push(parts.join(' '));
    }

    return formattedCriterias;
};
