import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Image, Platform } from 'react-native'
import React from 'react'
import Feather from 'react-native-vector-icons/Feather'
import { COLORS, FONTS } from '../assets/styles/styleGuide'
import { getGreetings } from '../utils/myUtils'
import { useApp, appStateSelectors } from '../states/app'
import { IUser } from '../models/user'
import { useNavigation } from '@react-navigation/native'
import { removeItem } from '../services/asyncStorage'
import { ASYNC_KEYS, SCREENS } from '../assets/enums'

interface appHeaderProps {
    title?: string;
    hideRightIcon?: boolean;
    showBack?: boolean;
}

const AppHeader = (props: appHeaderProps) => {
    const { hideRightIcon = false, showBack = false, title } = props
    const navigation = useNavigation()
    /**
     * STATES, PROPS AND HOOKS
     * **/
    const user = useApp(appStateSelectors.user) as any

    // HANDLE LOGOUT
    const handleNavigate = async () => {
        navigation.navigate(SCREENS.SETTINGS)

    }

    const handleGoBack = () => {
        navigation.goBack()
    }

    return (
        <View style={styles.main}>
            <View style={styles.profileContainer}>
                {
                    showBack &&
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => handleGoBack()}
                    >
                        <Feather name='arrow-left' color={COLORS.BLACK} size={24} />
                    </TouchableOpacity>
                }
                <View style={styles.titleContainer}>
                    {
                        title ?
                            <Text style={[styles.title, { fontSize: 18 }]}>{title}</Text>
                            :
                            <>
                                {/* <Text style={styles.greeting}>{getGreetings()}</Text>
                                <Text style={styles.title}>{user?.customerName || "NAME"}</Text> */}
                            </>
                    }
                </View>
            </View>

            {
                hideRightIcon == false &&
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => handleNavigate()}
                >
                    {
                        false ?
                            <ActivityIndicator />
                            :
                            <Feather name='user' color={COLORS.BLACK} size={26} />
                    }
                </TouchableOpacity>
            }
        </View>
    )
}

export default React.memo(AppHeader)

const styles = StyleSheet.create({
    main: {
        width: '100%',
        // borderBottomWidth: 0.8,
        borderColor: COLORS.GREY,
        paddingHorizontal: '4%',
        paddingVertical: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: COLORS.BACKGROUND,
        paddingTop: Platform.OS == 'ios' ? 60 : 10,
        minHeight: 60
    },
    profileContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    avatar: {
        width: 45,
        height: 45,
        borderRadius: 25
    },
    greeting: {
        color: COLORS.BLACK,
        fontFamily: FONTS.POPPINS_400,
        fontSize: 12
    },
    title: {
        color: COLORS.BLACK,
        fontFamily: FONTS.POPPINS_700,
        fontSize: 14,
        marginTop: 4
    },
    titleContainer: {
        marginLeft: 10
    }

})