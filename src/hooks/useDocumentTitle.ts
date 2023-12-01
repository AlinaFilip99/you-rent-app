import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { capitalize } from '../utils/util';

const useDocumentTitle = (title?: string) => {
    let location = useLocation();

    useEffect(() => {
        document.title = title ? capitalize(title) : capitalize(location.pathname.split('/')[1]);
        //eslint-disable-next-line
    }, [location]);
};
export default useDocumentTitle;
