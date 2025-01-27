import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import { COLORS, COMMON_STYLES, hp } from '../assets/styles/styleGuide'
import { Layout, PrimaryButton, PrimaryInput } from '../components'
import useSignIn from '../hooks/signIn'
import { isTab } from '../utils/myUtils'

const Login: React.FC = () => {
    const navigation = useNavigation()
    // const [email, setemail] = useState<string>('spa2corot@gmail.com')
    const [email, setemail] = useState<string>('test@openflow.pro')
    const [password, setpassword] = useState<string>('123456')
    // const [email, setemail] = useState<string>('')
    // const [password, setpassword] = useState<string>('')
    const { onSignIn, isLoading } = useSignIn()

    const handleLogin = async () => {
        onSignIn(email, password)
    }

    return (
        <Layout fixed={false}>
            <View style={styles.iconContainer}>
                    <Image
                        source={require('../assets/images/branding.png')}
                        style={styles.branding}
                    />
            </View>

            <View style={styles.context}>
                <PrimaryInput
                    title='email'
                    value={email}
                    onChange={setemail}
                />

                <PrimaryInput
                    title='password'
                    value={password}
                    onChange={setpassword}
                    isPassword={true}
                />

                <PrimaryButton
                    title='Login'
                    // isLoading={isLoading}
                    onPress={() => handleLogin()}
                />
            </View>

        </Layout>
    )
}

export default Login

const styles = StyleSheet.create({
    iconContainer: {
        width: '100%',
        height: hp(45),
        ...COMMON_STYLES.center_,
        backgroundColor: COLORS.BACKGROUND,
    },
    branding: {
        width: isTab() ? hp(50) : hp(40),
        height: isTab() ? hp(50) : hp(40),
        resizeMode: 'contain',
    },
    context: {
        paddingTop: hp(5)
    }
})