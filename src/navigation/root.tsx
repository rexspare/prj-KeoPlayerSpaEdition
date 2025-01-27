import { NavigationContainer } from '@react-navigation/native';
import React, { FC } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SCREENS } from '../assets/enums';
import { Splash } from '../screens';
import { StatusBar } from 'react-native';
import { COLORS } from '../assets/styles/styleGuide';
import AppStack from './appStack';

const Stack = createNativeStackNavigator();

const Root: FC = () => {
    return (
        <NavigationContainer>
            <StatusBar
                hidden
                backgroundColor={COLORS.PRIMARY}
                barStyle={'light-content'} />
            <Stack.Navigator screenOptions={{
                headerShown: false,
                animation: 'none'
            }}>
                <Stack.Screen name={SCREENS.SPLASH} component={Splash} />
                <Stack.Screen name={SCREENS.APP} component={AppStack} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default Root
