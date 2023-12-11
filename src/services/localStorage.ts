import LZString from 'lz-string';
class LocalStorage {
    static _cache: any = {};

    constructor() {}

    static getValue(path: string, decompressData: boolean = false) {
        let text = localStorage.getItem(path);
        if (text === null || typeof text === 'undefined' || text === 'undefined' || text === 'null') {
            return '';
        } else {
            if (decompressData) {
                let value = LZString.decompressFromUTF16(text);
                if (value && (value[0] == '{' || value[0] == '[')) {
                    //console.log(path + ' + found compressed');
                    return value;
                }

                value = LZString.decompress(text);
                if (value && (value[0] == '{' || value[0] == '[')) {
                    //console.log(path + ' - found incorrect compression');
                    this.writeObject(path, JSON.parse(value), true);
                    return value;
                } else {
                    if (text && (text[0] == '{' || text[0] == '[')) {
                        //console.log(path + ' - expected compressed but found uncompressed');
                        this.writeObject(path, JSON.parse(text), true);
                        return text;
                    }
                }

                return '';
            } else {
                return text;
            }
        }
    }

    static read(path: string): any {
        let data = this._cache[path];
        if (data == undefined) {
            data = this.getValue(path);
            this._cache[path] = data;
        }
        return data;
    }

    static readObject<T>(path: string, decompressData: boolean = false): T {
        let data = this._cache[path];
        if (data == undefined) {
            try {
                data = <T>JSON.parse(this.getValue(path, decompressData));
            } catch (error) {
                console.log(path + ' - invalid cache');
                this.clearCache();
                data = null;
            }
            this._cache[path] = data;
        }
        return data;
    }

    static readObjectNoCache<T>(path: string, decompressData: boolean = false): T | null {
        let data = null;
        try {
            data = <T>JSON.parse(this.getValue(path, decompressData));
        } catch (error) {
            console.log(path + ' - invalid cache');
            this.clearCache();
            data = null;
        }

        return data;
    }

    static write(path: string, text: string): void {
        try {
            localStorage.setItem(path, text);
            this._cache[path] = undefined;
        } catch (e) {
            if (this.isQuotaExceeded(e)) {
                // Storage full, maybe notify user or do some clean-up
            }
        }
    }

    static writeObject(path: string, data: any, compressData: boolean = false): void {
        let text: string = JSON.stringify(data);
        if (compressData) {
            text = LZString.compressToUTF16(text);
        }
        this.write(path, text);
    }

    static remove(path: string): void {
        localStorage.removeItem(path);
        this._cache[path] = undefined;
    }

    static clearCache(): void {
        this._cache = {};
    }

    static clear(): void {
        localStorage.clear();
        this._cache = {};
    }

    static isQuotaExceeded(e: any): boolean {
        let quotaExceeded = false;
        if (e) {
            if (e.code) {
                switch (e.code) {
                    case 22:
                        quotaExceeded = true;
                        break;

                    case 1014:
                        // Firefox
                        if (e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
                            quotaExceeded = true;
                        }
                        break;
                }
            } else if (e.number === -2147024882) {
                // Internet Explorer 8
                quotaExceeded = true;
            }
        }
        return quotaExceeded;
    }

    static dumpSize() {
        let _lsTotal = 0;

        // tslint:disable-next-line:forin
        for (let _x in localStorage) {
            if (_x.indexOf('IWC_') == -1) {
                let _xLen = ((localStorage[_x].length || 0) + (_x.length || 0)) * 2;
                _lsTotal += _xLen;
            }
        }
    }
}
export default LocalStorage;
