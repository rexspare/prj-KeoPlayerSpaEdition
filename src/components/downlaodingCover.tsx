import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const DownlaodingCover = () => {
    return (
        <View style={styles.main}>
            {/* <Image
                source={require('../assets/animations/downloading.gif')}
                style={styles.image}
            /> */}
        </View>
    )
}

export default DownlaodingCover

const styles = StyleSheet.create({
    main: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: 10,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        paddingHorizontal: '5%',
    },
    image: {
        width: 65,
        height: 65,
        resizeMode: 'contain',
        marginBottom:5
    }
})