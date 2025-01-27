import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { FC } from 'react';
import { SCREENS } from '../assets/enums';
import { Home, Loading, Login, Settings, Welcome } from '../screens';
import { appStateSelectors, useApp } from '../states/app';

const Stack = createNativeStackNavigator();

const AppStack: FC = () => {
    const isAppReady = useApp(appStateSelectors.isAppReady)

    return (
        <Stack.Navigator screenOptions={{
            headerShown: false,
            animation: 'none'
        }}>
            <Stack.Screen name={SCREENS.WELCOME} component={Welcome} />
            <Stack.Screen name={SCREENS.HOME} component={Home} />
            <Stack.Screen name={SCREENS.SETTINGS} component={Settings} />
            <Stack.Screen name={SCREENS.LOGIN} component={Login} />
            <Stack.Screen name={SCREENS.LOADING} component={Loading} />
        </Stack.Navigator>
    )
}

export default AppStack
