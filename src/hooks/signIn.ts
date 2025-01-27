import { appStateSelectors, useApp } from '../states/app';
import useApi, { BASE_URL } from './api';
import { setItem } from '../services/asyncStorage';
import React, { useState } from 'react'
import Toast from 'react-native-toast-message';
import DeviceInfo from 'react-native-device-info';
import { vaildateEmail } from '../utils/myUtils';
import { ALERT_HEADER, ALERT_TYPES, ASYNC_KEYS, SCREENS } from '../assets/enums';
import { useNavigation } from '@react-navigation/native';
import { Platform } from 'react-native';

const useSignIn = () => {
  const setAuthenticated = useApp(appStateSelectors.setAuthenticated);
  const setUser = useApp(appStateSelectors.setUser);
  const [isLoading, setisLoading] = useState<boolean>(false)
  const navigation = useNavigation()

  const { post } = useApi();

  const onSignIn = async (email: string, password: string, callBack?: any) => {
    try {
      if (!email || !vaildateEmail(email)) {
        Toast.show({
          type: ALERT_TYPES.WARNING,
          text1: ALERT_HEADER.WARNING,
          text2: 'Email is in valid!',
        });
        return
      }
      if (!password) {
        Toast.show({
          type: ALERT_TYPES.WARNING,
          text1: ALERT_HEADER.WARNING,
          text2: 'Password is required!',
        });
        return
      }

      setisLoading(true)
      const MAC_ADDRESS = Platform.OS == 'ios' ? await DeviceInfo.getDeviceToken() : await DeviceInfo.getUniqueId()
      // const MAC_ADDRESS = "1c:bf:ce:aa:30:b9"
      const body = {
        email: email,
        password: password,
        MACAddress: MAC_ADDRESS
      };

      const response = await post(BASE_URL + '/player-mobile/auth', body) as any;

      if (response.status === 200 && response.data?.user) {
        Toast.show({
          type: ALERT_TYPES.SUCCESS,
          text1: ALERT_HEADER.SUCCESS,
          text2: 'Successfully logged in!',
        });
        await setItem(ASYNC_KEYS.USER_DATA, response.data)
        setAuthenticated(true, response.data.token)
        setUser(response.data.user)
        navigation.replace(SCREENS.LOADING)
      } else {
        Toast.show({
          type: ALERT_TYPES.WARNING,
          text1: ALERT_HEADER.DANGER,
          text2: 'Invalid credentials!',
        });
      }
      setisLoading(false)

    } catch (error) {
      Toast.show({
        type: ALERT_TYPES.WARNING,
        text1: ALERT_HEADER.WARNING,
        text2: 'An error occurred!',
      });
      setisLoading(false)
    }
  }


  const onLogout = async () => {

  }

  return {
    onSignIn,
    onLogout,
    isLoading
  };
};

export default useSignIn;
