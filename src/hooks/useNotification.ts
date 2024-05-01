import { useIonToast } from '@ionic/react';
import { closeOutline } from 'ionicons/icons';
import { capitalize } from '../utils/util';

const useNotification = () => {
    const [present] = useIonToast();

    return (message: string, type?: string, callback?: Function) => {
        present({
            message: capitalize(message),
            duration: type === 'error' ? undefined : 1500,
            position: 'top',
            buttons:
                type === 'error'
                    ? [
                          {
                              icon: closeOutline,
                              role: 'cancel'
                          }
                      ]
                    : undefined,
            color: type === 'error' ? 'danger' : 'success',
            onDidDismiss: () => {
                callback && callback();
            }
        });
    };
};

export default useNotification;
