import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const EqualizerCover = () => {
    return (
        <View style={styles.main}>
            <Image
                source={require('../assets/animations/equalizer.gif')}
                style={styles.image}
            />
        </View>
    )
}

export default EqualizerCover

const styles = StyleSheet.create({
    main: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: 10,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        width:'80%',
        height: '80%',
        resizeMode:'contain'
    }
})