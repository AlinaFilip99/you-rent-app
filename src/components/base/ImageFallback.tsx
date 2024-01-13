import { useMemo, useState } from 'react';

interface IImageFallback {
    url: string;
    fallbackUrl?: string;
    className?: string;
    onClick?: Function;
}

const ImageFallback: React.FC<IImageFallback> = ({
    url,
    fallbackUrl = './assets/img/estate-fallback.png',
    className,
    onClick
}) => {
    const [hasPictureError, setHasPictureError] = useState<boolean>(false);

    const pictureUrl = useMemo(() => {
        let value = fallbackUrl;
        if (!hasPictureError) {
            value = url;
        }

        return value;
    }, [url, hasPictureError]);

    const onImageClick = () => {
        if (onClick) {
            onClick();
        }
    };

    return (
        <img className={className} src={pictureUrl} alt="img" onError={() => setHasPictureError(true)} onClick={onImageClick} />
    );
};

export default ImageFallback;
