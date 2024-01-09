import React, { useState, useRef, useEffect } from 'react';
import { IonIcon, IonModal } from '@ionic/react';
import { closeOutline } from 'ionicons/icons';
// Import Swiper - START
import { Swiper, SwiperSlide } from 'swiper/react';
import { Keyboard, Pagination, Navigation, Zoom } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/zoom';
// Import Swiper - END
import './ImageSwiper.scss';
import ImageFallback from './ImageFallback';
import { isIOS, isMobile } from '../../utils/util';

interface IImageSwiper {
    urls: string[];
    fullScreenMode?: { isVisible: boolean; onClose: Function } | undefined;
}

const ImageSwiper: React.FC<IImageSwiper> = ({ urls = [], fullScreenMode }) => {
    const [fullScreen, setFullScreen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    const modalRef = useRef<HTMLIonModalElement>(null);

    useEffect(() => {
        fullScreenMode?.isVisible && openModal();
    }, [fullScreenMode?.isVisible]);

    const openModal = (index: number = 0) => {
        if (fullScreen) {
            return;
        }
        setActiveIndex(index);
        setFullScreen(true);
    };

    const closeModal = () => {
        setFullScreen(false);
        if (fullScreenMode) {
            setActiveIndex(0);
            fullScreenMode.onClose();
            return;
        }
        setActiveIndex(activeIndex);
    };

    const navigate = (direction: number) => {
        setActiveIndex(activeIndex + direction);
    };

    const dismiss = () => modalRef.current?.dismiss();

    const swiperComponent = (
        <Swiper
            initialSlide={0}
            slidesPerView={1}
            spaceBetween={30}
            keyboard={{
                enabled: true
            }}
            pagination={{
                clickable: true
            }}
            navigation={!isMobile()}
            modules={[Keyboard, Pagination, Navigation, Zoom]}
            className={isMobile() ? ' mobile' : ''}
            loop={true}
            zoom={true}
            onNavigationNext={() => navigate(1)}
            onNavigationPrev={() => navigate(-1)}
        >
            {urls?.length &&
                urls.length > 0 &&
                urls.map((x, index) => (
                    <SwiperSlide key={index} onClick={() => openModal(index)} zoom={true}>
                        <ImageFallback url={x} />
                    </SwiperSlide>
                ))}
        </Swiper>
    );

    return (
        <>
            <IonModal
                ref={modalRef}
                className={'swipper-fullscreen' + (isMobile() ? ' mobile' : '') + (isIOS() ? ' ios-device' : '')}
                isOpen={fullScreen}
                backdropDismiss={false}
                onWillDismiss={() => closeModal()}
            >
                {swiperComponent}
                <IonIcon className="close-btn" icon={closeOutline} onClick={dismiss}></IonIcon>
            </IonModal>
            {!fullScreenMode && !fullScreen ? swiperComponent : <></>}
        </>
    );
};
export default ImageSwiper;
