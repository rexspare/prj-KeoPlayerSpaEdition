import { StyleSheet, Text, View } from 'react-native'
import React, { ReactNode } from 'react'
import { COLORS, FONTS } from '../assets/styles/styleGuide'
interface SettingsItemProps {
    title: any;
    children: ReactNode;
}

const SettingsItem = ({ title, children }: SettingsItemProps) => {
    return (
        <View style={styles.main}>
            <Text style={styles.title}>
                {title}
            </Text>
            {children}
        </View>
    )
}

export default SettingsItem

const styles = StyleSheet.create({
    main: {
        width: '100%',
        height:60,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: '5%',
        paddingVertical: 15,
        borderBottomWidth: 1 / 2,
        borderColor: COLORS.GREY
    },
    title: {
        color: COLORS.BLACK,
        fontFamily: FONTS.POPPINS_500,
        fontSize: 14
    }
})