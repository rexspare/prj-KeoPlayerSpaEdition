import {ViewStyle, View } from 'react-native'
import React from 'react'

interface spacerProps {
    styles?: ViewStyle;
    height ?: number;
}

const Spacer = ({ styles, height = 100 }: spacerProps) => {
    return (
        <View style={[{
            width: '100%',
            height: height
        }, styles]}>

        </View>
    )
}

export default Spacer
