import { IonIcon, IonRow } from '@ionic/react';
import { star, starOutline } from 'ionicons/icons';
import { useState } from 'react';
import './StarRating.scss';

const StarRating: React.FC<{ score: number }> = ({ score }) => {
    const defaultStars: number[] = [1, 2, 3, 4, 5];
    const [stars, setStars] = useState<number[]>(defaultStars);

    return (
        <IonRow className="stars">
            {stars &&
                stars.map((x) => {
                    return <IonIcon icon={score && x < score ? star : starOutline} className="star-icon" key={'star-' + x} />;
                })}
        </IonRow>
    );
};

export default StarRating;
