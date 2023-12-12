export const getFileExtension = (filePath: string): string => {
    let basename: string = filePath.split(/[\\/]/).pop() || ''; // extract file name from full path ...
    let pos = basename.lastIndexOf('.'); // get last position of `.`
    if (basename === '' || pos < 1) {
        // if file name is empty or `.` not found dot or dot is in the first position of the file name (0)
        return '';
    }

    return basename.slice(pos + 1);
};

export const getFileNameWithoutExtension = (filePath: string): string => {
    let basename: string = filePath.split(/[\\/]/).pop() || ''; // extract file name from full path ...
    let pos = basename.lastIndexOf('.'); // get last position of `.`
    if (basename === '' || pos < 1) {
        // if file name is empty or ...
        return basename; //  `.` not found (-1) or comes first (0)
    }
    return basename.slice(0, pos);
};

export const matchExtension = (fileName: string, validExtensions: string[]): boolean => {
    let isValidExtension = true;
    if (validExtensions) {
        let ext = getFileExtension(fileName.toLowerCase());
        if (validExtensions.indexOf(ext) === -1) {
            isValidExtension = false;
        }
    }
    return isValidExtension;
};

export const fromHumanFileSize = (humanFileSize: string): number => {
    let match = humanFileSize.match(/((?:[0-9]*[.])?[0-9]+)\s*(\w+)/);
    if (!match || match.length < 2) {
        return 0;
    }
    let size = parseFloat(match[1]);
    let unit = match[2].toLowerCase();

    let i = ['b', 'kb', 'mb', 'gb', 'tb'].indexOf(unit);
    if (i === -1) {
        return 0;
    } else {
        return size * Math.pow(1000, i);
    }
};

export const checkFileSize = (fileSize: number, maxFileSize: number): boolean => {
    let isValidFileSize = true;
    if (maxFileSize && fileSize > maxFileSize) {
        isValidFileSize = false;
    }
    return isValidFileSize;
};

export const checkMinFileSize = (fileSize: number, minFileSize: number): boolean => {
    let isValidFileSize = true;
    if (minFileSize !== undefined && fileSize < minFileSize) {
        isValidFileSize = false;
    }
    return isValidFileSize;
};

export const humanFileSize = (size: number): string => {
    if (!size || size === 0) {
        return '0 kB';
    }
    let i = Math.floor(Math.log(size) / Math.log(1000));
    return (size / Math.pow(1000, i)).toFixed(2) + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
};

const getErrorDescription = (error: any) => {
    let errorDescription;
    switch (error.code) {
        case 'invalid_extension':
            errorDescription = { key: 'GI_FileUploadInvalidExtension', fileName: error.fileName };
            break;
        case 'invalid_max_file_size':
            errorDescription = {
                key: 'GI_FileUploadInvalidSize',
                fileName: error.fileName,
                fileSize: humanFileSize(error.fileSize),
                maxFileSize: humanFileSize(error.maxFileSize)
            };
            break;
        case 'invalid_min_file_size':
            errorDescription = {
                key: 'GI_FileUploadInvalidMinSize',
                fileName: error.fileName,
                fileSize: humanFileSize(error.fileSize),
                maxFileSize: humanFileSize(error.maxFileSize)
            };
            break;
        case 'invalid_empty_file':
            errorDescription = { key: 'GI_FileUploadEmpty', fileName: error.fileName };
            break;
        default:
            break;
    }
    return errorDescription;
};

const getUploadErrors = (files: any[], minFileSize: number, maxFileSize: number) => {
    let errors: any = [];
    let error: any;
    for (let file of files) {
        if (file.invalidExtension) {
            errors.push({ code: 'invalid_extension', fileName: file.name });
        }
        if (file.invalidMaxSize) {
            error = { code: 'invalid_max_file_size', fileName: file.name, fileSize: file.size, maxFileSize };
            error.description = getErrorDescription(error);
            errors.push(error);
        }
        if (file.invalidMinSize) {
            error = { code: 'invalid_min_file_size', fileName: file.name, fileSize: file.size, minFileSize };
            error.description = getErrorDescription(error);
            errors.push(error);
        }
        if (file.invalidEmptyFile) {
            error = { code: 'invalid_empty_file', fileName: file.name };
            error.description = getErrorDescription(error);
            errors.push(error);
        }
    }
    return errors;
};

export const validateFiles = (files: any[], validExtensions: any[], minSize: any, maxSize: any, preventEmpty: boolean) => {
    let response: any = { validFileList: [], invalidFileList: [], hasErrors: false, errors: null };
    for (let file of files) {
        let validExtension = matchExtension(file.name, validExtensions);
        if (typeof minSize === 'string') {
            minSize = fromHumanFileSize(minSize);
        }
        if (typeof maxSize === 'string') {
            maxSize = fromHumanFileSize(maxSize);
        }
        let validMaxSize = checkFileSize(file.size, maxSize);
        let validMinSize = checkMinFileSize(file.size, minSize);
        let validEmptyFile = preventEmpty ? file.size > 0 : true;

        if (validExtension && validMinSize && validMaxSize && validEmptyFile) {
            response.validFileList.push(file);
        } else {
            if (!validExtension) {
                file.invalidExtension = true;
            }
            if (!validMinSize) {
                file.invalidMinSize = true;
            }
            if (!validMaxSize) {
                file.invalidMaxSize = true;
            }
            if (!validEmptyFile) {
                file.invalidEmptyFile = true;
            }
            response.invalidFileList.push(file);
        }
    }

    response.hasErrors = response.invalidFileList.length > 0;
    if (response.hasErrors) {
        response.errors = getUploadErrors(response.invalidFileList, minSize, maxSize);
    }

    return response;
};
