import { IonRow } from '@ionic/react';
import { useMemo } from 'react';
import moment from 'moment';

import './ProfileDescription.scss';
import OverflowText from '../base/OverflowText';
import { GenderType, RelationshipType } from '../../utils/enums';
import {
    BriefcaseIcon,
    CakeIcon,
    EmailIcon,
    GraduationHatIcon,
    HeartIcon,
    PersonIcon,
    PhoneIcon,
    PinIcon
} from '../../assets/svg-icons';
import ShowMoreText from '../base/ShowMoreText';

const ProfileDescription: React.FC<{ userData: IUser }> = ({ userData }) => {
    const { gender, birthday, relationship } = useMemo(() => {
        let gender, birthday, relationship;
        switch (userData.gender) {
            case GenderType.Female:
                gender = 'Female';
                break;
            case GenderType.Male:
                gender = 'Male';
                break;
            case GenderType.NotSay:
                gender = 'I prefer to not say';
                break;
            default:
                break;
        }
        switch (userData.relationshipStatusType) {
            case RelationshipType.Married:
                relationship = 'Married';
                break;
            case RelationshipType.Single:
                relationship = 'Single';
                break;
            case RelationshipType.Relationship:
                relationship = 'In a relationship';
                break;
            default:
                break;
        }
        if (userData.birthday) {
            birthday = moment(userData.birthday).format('MMMM Do YYYY');
        }
        return { gender, birthday, relationship };
    }, [userData]);

    const callUser = (phoneNumber?: string) => {
        if (phoneNumber) {
            let plainPhoneNumber = phoneNumber.replaceAll(' ', '');
            window.location.href = 'tel://' + plainPhoneNumber;
        }
    };

    const sendEmail = (email: string) => {
        window.location.href = 'mailto://' + email;
    };

    return (
        <div className="profile-description">
            {userData.workPlace && (
                <IonRow>
                    <BriefcaseIcon />
                    <OverflowText text={userData.workPlace} />
                </IonRow>
            )}
            {userData.highestEducation && (
                <IonRow>
                    <GraduationHatIcon />
                    <OverflowText text={userData.highestEducation} />
                </IonRow>
            )}
            {userData.from && (
                <IonRow>
                    <PinIcon />
                    <OverflowText text={userData.from} />
                </IonRow>
            )}
            {userData.phoneNumber && (
                <IonRow onClick={() => callUser(userData.phoneNumber)} className="action-row">
                    <PhoneIcon />
                    <OverflowText text={userData.phoneNumber} />
                </IonRow>
            )}
            {userData.email && (
                <IonRow onClick={() => sendEmail(userData.email)} className="action-row">
                    <EmailIcon />
                    <OverflowText text={userData.email} />
                </IonRow>
            )}
            {gender && (
                <IonRow>
                    <PersonIcon />
                    <OverflowText text={gender} />
                </IonRow>
            )}
            {birthday && (
                <IonRow>
                    <CakeIcon />
                    <OverflowText text={birthday} />
                </IonRow>
            )}
            {relationship && (
                <IonRow>
                    <HeartIcon />
                    <OverflowText text={relationship} />
                </IonRow>
            )}
            {userData.description && (
                <div className="description">
                    <ShowMoreText text={userData.description} />
                </div>
            )}
        </div>
    );
};

export default ProfileDescription;
