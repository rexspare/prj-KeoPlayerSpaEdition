import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Switch } from 'react-native'
import { Layout, Loader, SettingsItem, } from '../components'
import AppHeader from '../components/appHeader'
import { COLORS } from '../assets/styles/styleGuide'
import Feather from 'react-native-vector-icons/Feather'
import { useApp, appStateSelectors } from '../states/app'
import { IUser } from '../models/user'
import { useNavigation, CommonActions } from '@react-navigation/native'
import { getItem, removeItem, setItem } from '../services/asyncStorage'
import { ASYNC_KEYS, LAYOUTS, SCREENS } from '../assets/enums'
import RNFS from 'react-native-fs';
import { deleteFile } from '../utils/myUtils'
import { ISong } from '../models/app'
import ReactNativeBlobUtil from "react-native-blob-util";
import useSongs from '../hooks/songs'


const Settings: React.FC = () => {
    const navigation = useNavigation()
    const secondaryLayout = useApp(appStateSelectors.secondaryLayout) as any
    const setsecondaryLayout = useApp(appStateSelectors.setsecondaryLayout) as any
    const enableAgende = useApp(appStateSelectors.enableAgende) as any
    const setenableAgende = useApp(appStateSelectors.setenableAgende) as any
    const setIsAppReady = useApp(appStateSelectors.setIsAppReady) as any
    const enableWelcomeScreen = useApp(appStateSelectors.enableWelcomeScreen) as any
    const setEnableWelcomeScreen = useApp(appStateSelectors.setEnableWelcomeScreen) as any
    const user = useApp(appStateSelectors.user) as any
    const [localFiles, setlocalFiles] = useState<ISong[]>([])
    const [isDeleting, setisDeleting] = useState<boolean>(false)
    const { refreshList, isLoading } = useSongs()


    const toggleLayout = async () => {
        const value = secondaryLayout
        setsecondaryLayout(!secondaryLayout);
        await setItem(ASYNC_KEYS.LAYOUT, value ? LAYOUTS.PRIMARY : LAYOUTS.SECONDARY)
    }

    const toggleAgende = async () => {
        const value = enableAgende
        setenableAgende(!enableAgende);
        await setItem(ASYNC_KEYS.ENABLE_AGENDA, value ? LAYOUTS.PRIMARY : LAYOUTS.SECONDARY)
    }

    const toggleWelcomeScreen = async () => {
        const value = enableWelcomeScreen
        setEnableWelcomeScreen(!enableWelcomeScreen);
        await setItem(ASYNC_KEYS.ENABLE_WELCOME_SCREEN, value == true ? "false" : "true")
    }

    const handleLogout = async () => {
        await removeItem(ASYNC_KEYS.ACCESS_TOKEN)
        await removeItem(ASYNC_KEYS.USER_DATA)

        setIsAppReady(false)
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    {
                        name: SCREENS.LOGIN,
                    },
                ],
            }),
        );
    }

    const file = "file:///storage/emulated/0/Android/data/com.keoplayerspaedition/files/Pictures/file_1703067316011.mp3"


    useEffect(() => {
        const subscribe = navigation.addListener('focus', async () => {
            const songsList = await getItem(ASYNC_KEYS.SONGS, [])
            setlocalFiles(songsList)
        })

        return subscribe
    }, [navigation])


    const handleDeleteStorage = async () => {

        try {
            setisDeleting(true)
            await removeItem(ASYNC_KEYS.SONGS)
            await removeItem(ASYNC_KEYS.PLAY_LISTS)
            await removeItem(ASYNC_KEYS.AGENDE)

            let RootDir = ReactNativeBlobUtil.fs.dirs.PictureDir;
            let path = Platform.OS === 'ios' ?
                ReactNativeBlobUtil.fs.dirs['MainBundleDir'] : RNFS.DownloadDirectoryPath

            const downloadPath = `${path}/keo`
            const hiddenPath = `${RootDir}/keodec`

            const downloadPathExists = await RNFS.exists(downloadPath)
            if (downloadPathExists) {
                await ReactNativeBlobUtil.fs.unlink(downloadPath)
            }

            const hiddenPathExists = await RNFS.exists(hiddenPath)
            if (hiddenPathExists) {
                await ReactNativeBlobUtil.fs.unlink(hiddenPath)
            }

            setlocalFiles([])
            setTimeout(() => {
                setisDeleting(false)
            }, 500);
        } catch (error) {
            setTimeout(() => {
                setisDeleting(false)
            }, 500);
            console.log(error);
        }

    }


    const handleRefreshList = async () => {
        await refreshList(setisDeleting)
    }

    return (
        <Layout fixed={true}>
            <AppHeader
                showBack={true}
                hideRightIcon={true}
                title='Settings'
            />

            <SettingsItem
                title={"Secondary Layout"}
            >
                <Switch
                    trackColor={{ false: COLORS.GREY, true: COLORS.PRIMARY }}
                    thumbColor={'#f4f3f4'}
                    ios_backgroundColor={COLORS.PRIMARY}
                    onValueChange={toggleLayout}
                    value={secondaryLayout}
                />
            </SettingsItem>

            <SettingsItem
                title={"Enable Agende"}
            >
                <Switch
                    trackColor={{ false: COLORS.GREY, true: COLORS.PRIMARY }}
                    thumbColor={'#f4f3f4'}
                    ios_backgroundColor={COLORS.PRIMARY}
                    onValueChange={toggleAgende}
                    value={enableAgende}
                />
            </SettingsItem>

            <SettingsItem
                title={"Show Welcome Screen"}
            >
                <Switch
                    trackColor={{ false: COLORS.GREY, true: COLORS.PRIMARY }}
                    thumbColor={'#f4f3f4'}
                    ios_backgroundColor={COLORS.PRIMARY}
                    onValueChange={toggleWelcomeScreen}
                    value={enableWelcomeScreen}
                />
            </SettingsItem>

            <SettingsItem
                title={"Refresh List"}
            >
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => handleRefreshList()}
                >
                    <Feather
                        name='refresh-ccw'
                        color={COLORS.PRIMARY}
                        size={24} />
                </TouchableOpacity>
            </SettingsItem>

            <SettingsItem
                title={`Empty Storage (${localFiles?.length} files)`}
            >
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => handleDeleteStorage()}
                >
                    <Feather
                        name='trash'
                        color={COLORS.PRIMARY}
                        size={24} />
                </TouchableOpacity>
            </SettingsItem>

            <SettingsItem
                title={<Text>Logout from <Text style={styles.email}>{user?.email}</Text></Text>}
            >
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => handleLogout()}
                >
                    <Feather
                        name='log-out'
                        color={COLORS.PRIMARY}
                        size={24} />
                </TouchableOpacity>
            </SettingsItem>

            <Loader
                isLoading={isDeleting}
            />

        </Layout>
    )
}

export default Settings

const styles = StyleSheet.create({
    email: {
        color: COLORS.PRIMARY
    }
})