import { useEffect, useMemo, useState } from 'react';
import { IonButton, IonIcon, IonItem, IonLabel, IonList, IonRow } from '@ionic/react';
import { add, homeOutline, pencil, trashOutline } from 'ionicons/icons';

import './ProfileCriteriaList.scss';
import { capitalize, getSearchCriteriaUserFriendlyDescription } from '../../utils/util';
import { deleteSearchCriteria, getUserCriterias } from '../../services/user';
import userProfile from '../../services/userProfile';
import useNotification from '../../hooks/useNotification';
import CriteriaAddEdit from './CriteriaAddEdit';

interface IProfileCriteriaList {
    userId: string;
}

const ProfileCriteriaList: React.FC<IProfileCriteriaList> = ({ userId }) => {
    const setNotification = useNotification();
    const [searchCriterias, setSearchCriterias] = useState<ISearchCriteria[]>([]);
    const [showAddEditCriteria, setShowAddEditCriteria] = useState<boolean>(false);
    const [selectedCriteria, setSelectedCriteria] = useState<ISearchCriteria>();

    useEffect(() => {
        if (userId) {
            load();
        }
    }, [userId]);

    const load = async () => {
        let criteriaList = await getUserCriterias(userId);
        if (criteriaList) {
            setSearchCriterias(criteriaList);
        }
    };

    const searchCriteriaDescriptions = useMemo(() => {
        let list: { id?: string; description: string }[] = [];

        searchCriterias?.forEach((x) => {
            list.push({ id: x.id, description: getSearchCriteriaUserFriendlyDescription([x])[0] });
        });

        return list;
    }, [searchCriterias]);

    const onAddCriteria = () => {
        setShowAddEditCriteria(true);
    };

    const onCriteriaEdit = (criteriaId?: string) => {
        setShowAddEditCriteria(true);
        let selectedItem = searchCriterias.find((x) => x.id === criteriaId);
        if (selectedItem) {
            setSelectedCriteria(selectedItem);
        }
    };

    const onCriteriaDelete = async (criteriaId?: string) => {
        if (!criteriaId) {
            return;
        }
        try {
            await deleteSearchCriteria(userProfile.UserId, criteriaId);
            let newList = [...searchCriterias];
            newList = newList.filter((x) => x.id !== criteriaId);
            setSearchCriterias(newList);
            setNotification('Operation completed successfully!', 'success');
        } catch (error) {
            console.log({ error });
        }
    };

    const onMatchCriteria = (criteriaId?: string) => {
        //tbd: show estate list with criteria applied
    };

    const onCloseAddEditModal = (refreshList?: boolean) => {
        setShowAddEditCriteria(false);
        setSelectedCriteria(undefined);
        if (refreshList) {
            load();
        }
    };

    return (
        <>
            <CriteriaAddEdit isVisible={showAddEditCriteria} onClose={onCloseAddEditModal} criteria={selectedCriteria} />
            <div className="user-criteria-list">
                <IonButton className="add-button" onClick={onAddCriteria}>
                    <IonIcon slot="start" icon={add} />
                    Add criteria
                </IonButton>
                <IonList lines="full" className="criteria-list">
                    {searchCriteriaDescriptions.map((x) => {
                        return (
                            <IonItem key={x.id}>
                                <IonRow>
                                    <IonLabel>
                                        <span dangerouslySetInnerHTML={{ __html: capitalize(x.description) }}></span>
                                    </IonLabel>
                                    <IonRow className="criteria-actions">
                                        <IonButton
                                            fill="clear"
                                            onClick={() => {
                                                onMatchCriteria(x.id);
                                            }}
                                        >
                                            <IonIcon slot="icon-only" icon={homeOutline}></IonIcon>
                                        </IonButton>
                                        <IonButton
                                            fill="clear"
                                            onClick={() => {
                                                onCriteriaEdit(x.id);
                                            }}
                                        >
                                            <IonIcon slot="icon-only" icon={pencil}></IonIcon>
                                        </IonButton>
                                        <IonButton
                                            fill="clear"
                                            color="danger"
                                            onClick={() => {
                                                onCriteriaDelete(x.id);
                                            }}
                                        >
                                            <IonIcon slot="icon-only" icon={trashOutline}></IonIcon>
                                        </IonButton>
                                    </IonRow>
                                </IonRow>
                            </IonItem>
                        );
                    })}
                </IonList>
            </div>
        </>
    );
};

export default ProfileCriteriaList;
