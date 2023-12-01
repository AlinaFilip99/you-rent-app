import LZString from 'lz-string';

const _lsCache: any = {};
const _compressPrefix = '|__compressed__|';
const _jsonPrefix = '|__json__|';

/**
 * get value from local storage
 * @param {String} key key to retrieve
 * @param {String} defaultValue default value to return if key not found
 */
export const getLocalStorage = (key: string, defaultValue?: any): any => {
    try {
        if (!_lsCache[key]) {
            let storageData: string = window.localStorage.getItem(key) || '';
            let data: any = storageData;
            // check if it is compressed
            if (storageData.indexOf(_compressPrefix) === 0) {
                data = LZString.decompressFromUTF16(storageData.substring(_compressPrefix.length)) || '';
            }
            // check if it is a JSON object
            if (data.indexOf(_jsonPrefix) === 0) {
                data = JSON.parse(data.substring(_jsonPrefix.length));
            }
            _lsCache[key] = data || defaultValue;
        }
        return _lsCache[key];
    } catch (error) {
        console.error(error);
        return defaultValue;
    }
};

/**
 * set value in local storage
 * @param {String} key key to set
 * @param {Any} value value of the key
 */
export const setLocalStorage = (key: string, value: any, compress: boolean = false): void => {
    try {
        // Save to local storage
        _lsCache[key] = value;
        let data: any = value;
        if (typeof value === 'object') {
            let jsonValue = _jsonPrefix + JSON.stringify(value);
            data = compress ? _compressPrefix + LZString.compressToUTF16(jsonValue) : jsonValue;
        }
        window.localStorage.setItem(key, data);
    } catch (error) {
        console.error(error);
    }
};

/**
 * remove key from local storage
 * @param {String} key key to remove
 */
export const removeLocalStorage = (key: string) => {
    try {
        // remove from local storage
        window.localStorage.removeItem(key);
    } catch (error) {
        console.error(error);
    }
};

export const getToken = () => {
    return getLocalStorage('AccessToken') || '';
};

export const setToken = (token: string) => {
    setLocalStorage('AccessToken', token);
};
