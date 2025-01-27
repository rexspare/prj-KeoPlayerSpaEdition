import { ActivityIndicator, Image, Modal, StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { COLORS, FONTS } from '../assets/styles/styleGuide'
import PrimaryButton from './primaryButton'
import { removeItem } from '../services/asyncStorage'
import { ASYNC_KEYS } from '../assets/enums'
import { appStateSelectors, useApp } from '../states/app'

const SubsExpiredModal = ({ isLoading }: any) => {
    const setIsAppReady = useApp(appStateSelectors.setIsAppReady)

    const handleLogout = async () => {
        await removeItem(ASYNC_KEYS.ACCESS_TOKEN)
        await removeItem(ASYNC_KEYS.USER_DATA)
        setIsAppReady(false)
    }

    return (
        <Modal
            visible={isLoading}
            transparent
            style={{ flex: 1 }}
            onRequestClose={() => { }}
        >
            <View style={styles.main}>

                <View style={styles.container}>
                    <Image
                        source={require('../assets/images/expired.png')}
                        style={styles.image}
                    />
                    <Text style={styles.txt}>Your Subscription has expired!</Text>
                    <PrimaryButton
                        title='Sign out'
                        onPress={() => handleLogout()}
                        style={{ width: 150 }}
                    />
                </View>

            </View>

        </Modal>
    )
}

export default SubsExpiredModal

const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    container: {
        width: '80%',
        maxWidth: 300,
        paddingVertical: 20,
        borderRadius: 10,
        backgroundColor: 'rgba(206, 206, 206,1)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        width: 100,
        height: 100,
        resizeMode: 'contain'
    },
    txt: {
        color: COLORS.BLACK,
        fontFamily: FONTS.POPPINS_500,
        fontSize: 14,
        marginTop: 10
    }
})