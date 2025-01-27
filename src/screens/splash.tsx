import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { Alert, Image, Linking } from 'react-native'
import * as Progress from 'react-native-progress'
import { ASYNC_KEYS, LAYOUTS, SCREENS } from '../assets/enums'
import { COMMON_STYLES } from '../assets/styles/styleGuide'
import { Layout } from '../components'
import useSongs from '../hooks/songs'
import { IAgenda, IFilePath, IPlayList, ISong } from '../models/app'
import { getItem, mergeArray } from '../services/asyncStorage'
import { appStateSelectors, useApp } from '../states/app'
import { getFilesFromFolder, handleDownloadMedia, mergeAgendePlaylist } from '../utils/myUtils'
import { handleStoragePermission } from '../utils/permissionHandler'
import { decryptSong } from '../services/crypt'

const Splash: React.FC = () => {
    const navigation = useNavigation()
    const setUser = useApp(appStateSelectors.setUser)
    const setAuthenticated = useApp(appStateSelectors.setAuthenticated)
    const setsecondaryLayout = useApp(appStateSelectors.setsecondaryLayout)
    const setenableAgende = useApp(appStateSelectors.setenableAgende)
    const setEnableWelcomeScreen = useApp(appStateSelectors.setEnableWelcomeScreen)
    const enableWelcomeScreen = useApp(appStateSelectors.enableWelcomeScreen)
    const isAppReady = useApp(appStateSelectors.isAppReady)
    const setIsAppReady = useApp(appStateSelectors.setIsAppReady)

    const { getPlayLists, getPlayListSongs, getAgenda, getPlayListSongsInitial } = useSongs()

    const [isDownloading, setisDownloading] = useState(false)
    const [downloadedSongs, setdownloadedSongs] = useState<ISong[]>([])
    const [songsList, setsongsList] = useState<any[]>([])

    useEffect(() => {
        getUser()
    }, [])

    /**
 * CHECK FOR SSSIONS
 * **/
    const getUser = async () => {
        getItem(ASYNC_KEYS.LAYOUT, LAYOUTS.PRIMARY)
            .then((data) => {
                setsecondaryLayout(data == LAYOUTS.PRIMARY ? false : true)
            })
        let enableAgende = true
        getItem(ASYNC_KEYS.ENABLE_AGENDA, LAYOUTS.PRIMARY)
            .then((data) => {
                enableAgende = data == LAYOUTS.PRIMARY ? false : true
                setenableAgende(data == LAYOUTS.PRIMARY ? false : true)
            })

        getItem(ASYNC_KEYS.USER_DATA, null)
            .then(async (data: any) => {
                if (data != null) {
                    setUser(data?.user)
                    setAuthenticated(true, data?.token)
                    getData(data?.token, data?.user?.AgendaId, enableAgende)

                } else {
                    setTimeout(() => {
                        navigation.replace(SCREENS.APP, {
                            screen: SCREENS.LOGIN
                        })
                    }, 1000);
                }
            })
    }

    const getData = async (token: string, AgendaId: string, enableAgende?: boolean) => {
        let AGENDES: any = []
        if (true) {
            AGENDES = await getAgenda(token, AgendaId)
        }

        await getPlayLists(token,
            (playLists_: IPlayList[], token: string) => downLoadSongs(playLists_, token, AGENDES))
    }

    const calculatePercentage = (part: any, whole: any) => {
        if (isNaN(part) || isNaN(whole) || whole === 0) {
            return 0; // Return 0 if either part or whole is not a number, or if whole is 0 to avoid division by zero.
        }

        return (part / whole) * 100;
    }

    const percentageToFraction = (percentage: number) => {
        if (isNaN(percentage)) {
            return 0; // Return 0 if the input is not a number.
        }

        return percentage / 100;
    }


    const downLoadSongs = async (playLists_: IPlayList[], token: string, AGENDES: IAgenda[]) => {

        const playLists = await mergeAgendePlaylist(playLists_, AGENDES)

        const permission = await handleStoragePermission()
        if (permission != true) {
            Alert.alert('Error', 'Storage Permission Not Granted', [
                {
                    text: 'Allow in settings',
                    onPress: () => Linking.openSettings(),
                },
            ]);
            return
        }

        if (playLists?.length > 0) {


            for (let PL_Index = 0; PL_Index < playLists.length; PL_Index++) {
                const playListSingle = playLists[PL_Index];
                const alreadyDownloadedSongs = await getFilesFromFolder(playListSingle.ScenarioID, false)

                // IF FIRST PLAYLIST HAS DOWNLOADED GO TO HOME
                if (PL_Index == 1) {
                    break
                }

                const SingleSongsList = await getPlayListSongsInitial(playListSingle.ScenarioID, () => { }, false, token,) as any
                setsongsList(SingleSongsList)
                setisDownloading(true)
                const DOWNLOADED_SONGS = alreadyDownloadedSongs

                for (let S_Index = 0; S_Index < SingleSongsList.length; S_Index++) {
                    // IF 10 SONGS HAS BEEN DOWNLOADED
                    if (DOWNLOADED_SONGS?.length >= 9) {
                        break
                    }

                    const exists = alreadyDownloadedSongs.find((song: IFilePath) => song.fileName == `${SingleSongsList[S_Index].id}.mp3`)
                    let resDown: undefined | ISong = undefined
                    if (!exists) {
                        resDown = await handleDownloadMedia(
                            SingleSongsList[S_Index].url,
                            playListSingle.ScenarioID,
                            SingleSongsList[S_Index].id,
                        ) as ISong
                    }
                    DOWNLOADED_SONGS.push({ ...SingleSongsList[S_Index], url: resDown })
                    await mergeArray(ASYNC_KEYS.SONGS, { ...SingleSongsList[S_Index], url: resDown || "" })

                    setdownloadedSongs((prev) => {
                        return [...prev, { ...SingleSongsList[S_Index], url: resDown }]
                    })
                }

                // IF THERE IS ONLY ONE PLAYLIST
                if (playLists.length == 1) {
                    break
                }

            }

        }

        setisDownloading(false)
        downLoadSongsRest(playLists_, token, AGENDES)

        getItem(ASYNC_KEYS.ENABLE_WELCOME_SCREEN, "true2")
        .then((data) => {
            
            setEnableWelcomeScreen(data == "true" ? true : false)
            navigation.replace(SCREENS.APP, {
                screen: data == "true"  ? SCREENS.WELCOME : SCREENS.HOME
            })
        })

       

    }


    const downLoadSongsRest = async (playLists_: IPlayList[], token: string, AGENDES: IAgenda[]) => {

        const playLists = await mergeAgendePlaylist(playLists_, AGENDES)

        const permission = await handleStoragePermission()
        if (permission != true) {
            Alert.alert('Error', 'Storage Permission Not Granted', [
                {
                    text: 'Allow in settings',
                    onPress: () => Linking.openSettings(),
                },
            ]);
            return
        }

        if (playLists?.length > 0) {

            for (let PL_Index = 0; PL_Index < playLists.length; PL_Index++) {
                const playListSingle = playLists[PL_Index];
                const alreadyDownloadedSongs = await getFilesFromFolder(playListSingle.ScenarioID, false)

                const SingleSongsList = await getPlayListSongsInitial(playListSingle.ScenarioID, () => { }, false, token,) as any
                setsongsList(SingleSongsList)
                setisDownloading(true)
                const DOWNLOADED_SONGS = alreadyDownloadedSongs

                for (let S_Index = 0; S_Index < SingleSongsList.length; S_Index++) {

                    const exists = alreadyDownloadedSongs.find((song: IFilePath) => song.fileName == `${SingleSongsList[S_Index].id}.mp3`)
                    let resDown: undefined | ISong = undefined
                    if (!exists) {
                        resDown = await handleDownloadMedia(
                            SingleSongsList[S_Index].url,
                            playListSingle.ScenarioID,
                            SingleSongsList[S_Index].id,
                        ) as ISong
                    }
                    DOWNLOADED_SONGS.push({ ...SingleSongsList[S_Index], url: resDown })
                    await mergeArray(ASYNC_KEYS.SONGS, { ...SingleSongsList[S_Index], url: resDown || "" })

                    setdownloadedSongs((prev) => {
                        return [...prev, { ...SingleSongsList[S_Index], url: resDown }]
                    })
                }
            }
        }
    }



    return (
        <Layout
            fixed={true}
            containerStyle={COMMON_STYLES.center_}
        >
            <Image
                source={require('../assets/animations/musicLoader.gif')}
                style={{
                    width: 150,
                    height: 150
                }}
            />

            <Progress.Bar
                size={100}
                indeterminate={!isDownloading}
                progress={percentageToFraction(calculatePercentage(downloadedSongs?.length, 10))}
                borderWidth={1}
                thickness={2}
                showsText={true}
            />

        </Layout>
    )
}

export default Splash
