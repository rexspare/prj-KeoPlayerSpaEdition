import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Layout, PrimaryButton } from '../components'
import { COMMON_STYLES, FONTS, hp } from '../assets/styles/styleGuide'
import { isTab } from '../utils/myUtils'
import { useNavigation } from '@react-navigation/native'
import { SCREENS } from '../assets/enums'

const Welcome: React.FC = () => {
    const navigation = useNavigation()
    return (
        <Layout
            fixed={true}
            containerStyle={COMMON_STYLES.center_}
        >
            <Image
                source={require('../assets/images/brandingCrop.png')}
                style={styles.branding}
            />

            <PrimaryButton
                title={`COMMENCER L'EXPERIENCE`}
                onPress={() => { 
                    navigation.replace(SCREENS.APP, {
                        screen: SCREENS.HOME
                    })
                }}
                style={styles.btn}
                textStyle={styles.btnTxt}
            />

        </Layout>
    )
}

export default Welcome

const styles = StyleSheet.create({
    branding: {
        width: isTab() ? hp(50) : hp(40),
        height: isTab() ? hp(20) : hp(13),
        resizeMode:'contain'
    },
    btn: {
        width: isTab() ? hp(38) : hp(28),
        height: 55,
        marginTop: isTab() ? hp(8) : hp(7)
    },
    btnTxt: {
        fontFamily: FONTS.POPPINS_400
    }
})