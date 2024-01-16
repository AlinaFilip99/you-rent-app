import { IonIcon, IonRow } from '@ionic/react';
import { star, starOutline } from 'ionicons/icons';
import { useState } from 'react';
import './StarRating.scss';

const StarRating: React.FC<{ score: number; onClick?: Function }> = ({ score, onClick }) => {
    const defaultStars: number[] = [1, 2, 3, 4, 5];
    const [stars, setStars] = useState<number[]>(defaultStars);

    const onStarClick = (starNumber: number) => {
        if (onClick) {
            onClick(starNumber);
        }
    };

    return (
        <IonRow className="stars">
            {stars &&
                stars.map((x) => {
                    return (
                        <IonIcon
                            icon={score && x <= score ? star : starOutline}
                            className="star-icon"
                            key={'star-' + x}
                            onClick={() => onStarClick(x)}
                        />
                    );
                })}
        </IonRow>
    );
};

export default StarRating;
