import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { Alert, Linking, Text } from 'react-native'
import * as Progress from 'react-native-progress'
import { ASYNC_KEYS, SCREENS } from '../assets/enums'
import { COMMON_STYLES, FONTS } from '../assets/styles/styleGuide'
import { Layout } from '../components'
import useSongs from '../hooks/songs'
import { IAgenda, IFilePath, IPlayList, ISong } from '../models/app'
import { mergeArray } from '../services/asyncStorage'
import { appStateSelectors, useApp } from '../states/app'
import { getFilesFromFolder, handleDownloadMedia, mergeAgendePlaylist } from '../utils/myUtils'
import { handleStoragePermission } from '../utils/permissionHandler'

const Loading: React.FC = () => {
    const navigation = useNavigation()
    const user = useApp(appStateSelectors.user)
    const enableAgende = useApp(appStateSelectors.enableAgende)
    const setIsAppReady = useApp(appStateSelectors.setIsAppReady)

    const { getPlayLists, getPlayListSongs, getAgenda, getPlayListSongsInitial } = useSongs()
    const [isDownloading, setisDownloading] = useState(false)
    const [downloadedSongs, setdownloadedSongs] = useState<ISong[]>([])
    const [songsList, setsongsList] = useState<ISong[]>([])

    useEffect(() => {
        getData()
    }, [])

    const getData = async () => {
        let AGENDES: any = []
        if (enableAgende) {
            AGENDES = await getAgenda('', user?.AgendaId)
        }

        await getPlayLists('',
            (playLists_: IPlayList[], token: string) => downLoadSongs(playLists_, token, AGENDES))
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
                const DOWNLOADED_SONGS = []

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
        navigation.replace(SCREENS.APP, {
            screen: SCREENS.WELCOME
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
                const DOWNLOADED_SONGS = []

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


    const testProm = ({ PL_Index, S_Index }: any) => {
        return new Promise((res, rej) => {
            setTimeout(() => {
                res({ PL_Index, S_Index })
            }, 500);

        })
    }

    function calculatePercentage(part: any, whole: any) {
        if (isNaN(part) || isNaN(whole) || whole === 0) {
            return 0; // Return 0 if either part or whole is not a number, or if whole is 0 to avoid division by zero.
        }

        return (part / whole) * 100;
    }

    function percentageToFraction(percentage: number) {
        if (isNaN(percentage)) {
            return 0; // Return 0 if the input is not a number.
        }

        return percentage / 100;
    }

    return (
        <Layout
            fixed={true}
            containerStyle={COMMON_STYLES.center_}
        >
            <Text style={{
                fontFamily: FONTS.POPPINS_500,
                fontSize: 18,
            }}>{calculatePercentage(downloadedSongs?.length, 10).toPrecision(3)}%</Text>
            <Progress.Bar
                size={100}
                indeterminate={!isDownloading}
                progress={percentageToFraction(calculatePercentage(downloadedSongs?.length, 10))}
                borderWidth={1}
                thickness={2}
                showsText={true}
            // formatText={(progress) => {
            //     console.log(progress);
            //     return (

            // }}
            />


        </Layout>
    )
}

export default Loading
