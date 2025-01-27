import { StyleSheet, Text, TextInput, View, ViewStyle, TouchableOpacity, TextStyle } from 'react-native'
import React, { FC, useState } from 'react'
import If from './if';
import Feather from 'react-native-vector-icons/Feather'
import { COMMON_STYLES, COLORS, FONTS, hp, wp } from '../assets/styles/styleGuide';

interface primaryInputPros {
    title?: string;
    onChange: (txt: any) => any;
    isPassword?: Boolean;
    containerStyles?: ViewStyle;
    inputStyles?: any;
    inputContainer?: ViewStyle;
    value?: any;
    keyBoardType?: any;
    titleStyles?: TextStyle;
    editable?: boolean;
    hideTitle?: boolean;
    iconName?: string;
    multiline?: boolean;
    renderRightIcon?: any;
    placeholder?: string;
    isError?: boolean;
    inputRef?: any;
    maxLength?: number;
    onFocus?: () => {}
}

const PrimaryInput: FC<primaryInputPros> = (props: primaryInputPros) => {
    const [isSecureTextEntry, setisSecureTextEntry] = useState(true)
    const [isFocused, setisFocused] = useState(false)

    return (
        <View style={[styles.main, props.containerStyles]}>
            <If condition={props.hideTitle != true}>
                <View style={styles.titleContainer}>
                    <Text style={[styles.title, props.titleStyles]}>{props.title}</Text>
                </View>
            </If>
            {/* TEXT INPUT */}
            <View style={[styles.container, props.inputContainer,
            { borderColor: props?.isError ? COLORS.DANGER : isFocused ? COLORS.PRIMARY : COLORS.GREY }]}>
                <TextInput
                    ref={props.inputRef}
                    style={[
                        styles.input,
                        props.inputStyles,
                        props.multiline == true ? { textAlignVertical: 'top' } : {}
                    ]}
                    value={props.value || ""}
                    secureTextEntry={props?.iconName ? false : props.isPassword == true ? isSecureTextEntry : false}
                    onChangeText={(txt) => props.onChange(txt)}
                    keyboardType={props.keyBoardType}
                    editable={props.editable}
                    placeholder={props?.placeholder || ""}
                    multiline={props.multiline == true ? true : false}
                    onFocus={() => setisFocused(true)}
                    onBlur={() => setisFocused(false)}
                    {...props}
                />

                <If condition={props.isPassword == true}>
                    <TouchableOpacity style={styles.eyeBtn}
                        activeOpacity={0.8}
                        onPress={() => setisSecureTextEntry(!isSecureTextEntry)}
                    >
                        {
                            props?.renderRightIcon ?
                                props?.renderRightIcon :
                                <Feather
                                    name={props?.iconName ? props?.iconName : isSecureTextEntry ? 'eye' : 'eye-off'}
                                    color={COLORS.BLACK}
                                    size={21} />

                        }
                    </TouchableOpacity>

                </If>

            </View>
        </View>
    )
}

PrimaryInput.defaultProps = {
    title: 'title',
    onChange: () => { },
    isPassword: false,
    value: 'value',
    keyBoardType: 'default',
    editable: true
}

export default React.memo(PrimaryInput)

const styles = StyleSheet.create({
    main: {
        width: wp(86.5),
        maxWidth :550,
        alignSelf: 'center',
        marginVertical: 11,
        backgroundColor: COLORS.BACKGROUND,
    },
    title: {
        color: COLORS.BLACK,
        fontSize: 13,
        marginBottom: 2,
        fontFamily: FONTS.POPPINS_400
    },
    container: {
        borderWidth: 0.8,
        flexDirection: 'row',
        borderRadius: 4,
        borderColor: COLORS.GREY,
    },
    input: {
        flex: 1,
        height: 45,
        paddingHorizontal: 10,
        fontSize: 14,
        fontFamily: FONTS.POPPINS_600,
        color: COLORS.BLACK
    },
    eyeBtn: {
        ...COMMON_STYLES.center_,
        paddingHorizontal: 10
    },
    titleContainer: {
        backgroundColor: COLORS.BACKGROUND, // Same color as background
        alignSelf: "flex-start", // Have View be same width as Text inside
        paddingHorizontal: 10, // Amount of spacing between border and first/last letter
        marginStart: wp(2.5), // How far right do you want the label to start
        zIndex: 1, // Label must overlap border
        elevation: 1, // Needed for android
        shadowColor: "white", // Same as background color because elevation: 1 creates a shadow that we don't want
        position: "absolute", // Needed to be able to precisely overlap label with border
        top: -10, // Vertical position of label. Eyeball it to see where label intersects border.
    }
})