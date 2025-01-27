import { StyleSheet } from "react-native"
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';


const FONTS = {
    POPPINS_100: "Poppins-Thin",
    POPPINS_200: "Poppins-ExtraLight",
    POPPINS_300: "Poppins-Light",
    POPPINS_400: "Poppins-Regular",
    POPPINS_500: "Poppins-Medium",
    POPPINS_600: "Poppins-SemiBold",
    POPPINS_700: "Poppins-Bold",
    POPPINS_800: "Poppins-ExtraBold",
}

const COLORS = {
    PRIMARY :"#270B36",
    WHITE: "#FFFFFF",
    BLACK: "#000000",
    BACKGROUND: "#FFFFFF",
    GREY: "#d3d3d3",
    DANGER: "#bb2124"
}

const COMMON_STYLES = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: COLORS.BACKGROUND
    },
    center_: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    h1: {
        fontFamily: FONTS.POPPINS_700,
        color: COLORS.BLACK,
        fontSize: hp(2)
    },
    h2: {
        fontFamily: FONTS.POPPINS_600,
        color: COLORS.BLACK,
        fontSize: hp(2)
    },
    h3: {
        fontFamily: FONTS.POPPINS_500,
        color: COLORS.BLACK,
        fontSize: hp(2)
    },
    h4: {
        fontFamily: FONTS.POPPINS_400,
        color: COLORS.BLACK,
        fontSize: hp(2)
    },
    h5: {
        fontFamily: FONTS.POPPINS_300,
        color: COLORS.BLACK,
        fontSize: hp(2)
    },
    h6: {
        fontFamily: FONTS.POPPINS_200,
        color: COLORS.BLACK,
        fontSize: hp(2)
    },
    h7: {
        fontFamily: FONTS.POPPINS_100,
        color: COLORS.BLACK,
        fontSize: hp(2)
    },

})

export {
    wp,
    hp,
    FONTS,
    COLORS,
    COMMON_STYLES
}