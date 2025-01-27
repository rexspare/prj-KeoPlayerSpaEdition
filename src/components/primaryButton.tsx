import { ActivityIndicator, StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle, } from 'react-native'
import React, { FC } from 'react'
import { COLORS, wp, hp, FONTS, COMMON_STYLES } from '../assets/styles/styleGuide';


interface primaryButtonProps {
    title: string;
    onPress: () => any;
    style?: ViewStyle | [ViewStyle] | any;
    textStyle?: TextStyle | [TextStyle] | any;
    isLoading?: boolean;
}

const PrimaryButton: FC<primaryButtonProps> = (props: primaryButtonProps) => {
    return (
        <TouchableOpacity
            style={[styles.main, props.style]}
            activeOpacity={0.8}
            onPress={() => props.onPress()}
            disabled={props.isLoading}
        >
            {
                props.isLoading ?
                    <ActivityIndicator color={COLORS.WHITE} />
                    :
                    <Text style={[styles.title, props.textStyle]}>{props.title}</Text>
            }
        </TouchableOpacity>
    )
}

PrimaryButton.defaultProps = {
    title: 'title',
    onPress: () => { },
    isLoading: false
}

export default React.memo(PrimaryButton)

const styles = StyleSheet.create({
    main: {
        width: wp(86.5),
        maxWidth:550,
        alignSelf: 'center',
        marginVertical: hp(1.5),
        backgroundColor: COLORS.PRIMARY,
        ...COMMON_STYLES.center_,
        height: 45,
        borderRadius: 4
    },
    title: {
        color: COLORS.WHITE,
        fontSize: 15,
        fontFamily: FONTS.POPPINS_700
    }
})