import { useMemo, useState } from 'react';

interface IImageFallback {
    url: string;
    fallbackUrl?: string;
    className?: string;
}

const ImageFallback: React.FC<IImageFallback> = ({ url, fallbackUrl = './assets/img/estate-fallback.png', className }) => {
    const [hasPictureError, setHasPictureError] = useState<boolean>(false);

    const pictureUrl = useMemo(() => {
        let value = fallbackUrl;
        if (!hasPictureError) {
            value = url;
        }

        return value;
    }, [url, hasPictureError]);

    return <img className={className} src={pictureUrl} alt="img" onError={() => setHasPictureError(true)} />;
};

export default ImageFallback;
