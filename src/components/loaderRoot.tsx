import { ActivityIndicator, Modal, StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { COLORS } from '../assets/styles/styleGuide'
import { appStateSelectors, useApp } from '../states/app'

const LoaderRoot = ({ }: any) => {
    const rootLoading = useApp(appStateSelectors.rootLoading)

    return (
        <Modal
            visible={rootLoading}
            transparent
            style={{ flex: 1 }}
            onRequestClose={() => { }}
        >
            <View style={styles.main}>

                <View style={styles.container}>
                    <ActivityIndicator size={'large'} color={COLORS.PRIMARY} />
                    <Text style={styles.text}>Downloading Playlist...</Text>
                </View>

            </View>

        </Modal>
    )
}

export default LoaderRoot

const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    container: {
        padding: 20,
        borderRadius: 10,
        backgroundColor: 'rgba(206, 206, 206,1)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        fontSize: 12,
        color: COLORS.PRIMARY,
        fontWeight: '500',
        marginTop: 10
    }
})