import { request, check, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { Platform, PermissionsAndroid } from 'react-native';
import DeviceInfo from 'react-native-device-info';

export const handleStoragePermission = async () => {
    if (Platform.OS == 'ios') {
        return true
    } else {
        try {
            const apiLevel =await DeviceInfo.getApiLevel()
            const PERM = apiLevel < 33 ?
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
            :
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO
            
            const granted = await PermissionsAndroid.request(
                PERM,
                {
                    title: 'Storage Permission Required',
                    message: 'Application needs access to your storage to download File',
                    buttonPositive: 'OK'
                }
            );

            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                // Start downloading

                return true
            } else {
                // If permission denied then show alert
                return false

            }
        } catch (err) {
            // To handle permission related exception
            console.log("++++" + err);
        }
    }
};