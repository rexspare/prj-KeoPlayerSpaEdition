import { ActivityIndicator, Modal, StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { COLORS } from '../assets/styles/styleGuide'

const Loader = ({ isLoading }: any) => {

    return (
        <Modal
            visible={isLoading}
            transparent
            style={{ flex: 1 }}
            onRequestClose={() => { }}
        >
            <View style={styles.main}>

                <View style={styles.container}>
                    <ActivityIndicator size={'large'} color={COLORS.PRIMARY} />
                </View>

            </View>

        </Modal>
    )
}

export default Loader

const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    container: {
        width: 100,
        height: 100,
        borderRadius: 10,
        backgroundColor: 'rgba(206, 206, 206,1)',
        justifyContent: 'center',
        alignItems: 'center'
    }
})