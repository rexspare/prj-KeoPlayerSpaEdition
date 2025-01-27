import { appStateSelectors, useApp } from '../states/app';
import useApi, { BASE_URL } from './api';
import { getItem, mergeArray, setItem } from '../services/asyncStorage';
import React, { useState } from 'react'
import Toast from 'react-native-toast-message';
import DeviceInfo from 'react-native-device-info';
import { getFilesFromFolder, getTrackPlayerList, getUniqueItems, handleDownloadMedia, mergeAgendePlaylist, shuffleArray, vaildateEmail } from '../utils/myUtils';
import { ALERT_HEADER, ALERT_TYPES, ASYNC_KEYS } from '../assets/enums';
import { IFilePath, IPlayList, ISong } from '../models/app';
import { decryptSongsFolder } from '../services/crypt';
import { Alert, Linking, Platform } from 'react-native';
import { handleStoragePermission } from '../utils/permissionHandler';

const useSongs = () => {
    const user = useApp(appStateSelectors.user)
    const setAgendes = useApp(appStateSelectors.setAgendes);
    const setPlayLists = useApp(appStateSelectors.setPlayLists);
    const setPlayListSongs = useApp(appStateSelectors.setPlayListSongs);
    const [isLoading, setisLoading] = useState<boolean>(false)
    const [isSongsLoading, setisSongsLoading] = useState<boolean>(false)
    const [downloadedSongs, setdownloadedSongs] = useState<ISong[]>([])

    const { get, post } = useApi();

    const getAgenda = async (token?: string, AgendaID?: string, callBack: Function = () => { }) => {
        try {
            const localRes = await getItem(ASYNC_KEYS.AGENDE, [])
            if (localRes?.length > 0) {
                setAgendes(localRes)
                callBack(localRes, token)
                return localRes
            }


            setisLoading(true)
            let config = {}
            if (token) {
                config = {
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        Authorization: 'Bearer ' + token,
                    },
                };
            }
            const response = await post(BASE_URL + '/player-mobile/agenda/get-agenda',
                {
                    AgendaID: AgendaID
                },
                token ? config : undefined
            ) as any;
            setisLoading(false)

            if (response.status === 200 && response.data.agandes) {
                setAgendes(response.data.agandes)
                await setItem(ASYNC_KEYS.AGENDE, response.data.agandes)
                callBack(response.data.agandes, token)
                return response.data.agandes
            } else {
                Toast.show({
                    type: ALERT_TYPES.WARNING,
                    text1: ALERT_HEADER.DANGER,
                    text2: 'An error occurred!',
                });
                const localRes = await getItem(ASYNC_KEYS.AGENDE, [])
                setAgendes(localRes)
                callBack(localRes, token)
                return localRes
            }

        } catch (error) {
            const localRes = await getItem(ASYNC_KEYS.AGENDE, [])
            setAgendes(localRes)
            callBack(localRes, token)
            Toast.show({
                type: ALERT_TYPES.WARNING,
                text1: ALERT_HEADER.WARNING,
                text2: 'An error occurred!',
            });
            setisLoading(false)
            return localRes

        }
    }

    const getPlayLists = async (token?: string, callBack: Function = () => { }) => {
        try {
            const localRes = await getItem(ASYNC_KEYS.PLAY_LISTS, [])
            if (localRes?.length > 0) {
                setPlayLists(localRes)
                callBack(localRes, token)
                return localRes
            }

            setisLoading(true)
            let config = {}
            if (token) {
                config = {
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        Authorization: 'Bearer ' + token,
                    },
                };
            }
            const response = await get(BASE_URL + '/player-mobile/devices/playlists',
                token ? config : undefined
            ) as any;
            setisLoading(false)

            if (response.status === 200 && response.data) {
                setPlayLists(response.data)
                await setItem(ASYNC_KEYS.PLAY_LISTS, response.data)
                callBack(response.data, token)
                return response.data
            } else {
                Toast.show({
                    type: ALERT_TYPES.WARNING,
                    text1: ALERT_HEADER.DANGER,
                    text2: 'An error occurred!',
                });
                const localRes = await getItem(ASYNC_KEYS.PLAY_LISTS, [])
                setPlayLists(localRes)
                callBack(localRes, token)
                return localRes
            }

        } catch (error) {
            const localRes = await getItem(ASYNC_KEYS.PLAY_LISTS, [])
            setPlayLists(localRes)
            callBack(localRes, token)
            Toast.show({
                type: ALERT_TYPES.WARNING,
                text1: ALERT_HEADER.WARNING,
                text2: 'An error occurred!',
            });
            setisLoading(false)
            return false

        }
    }

    const getPlayListSongs = async (id: string, callBack: Function = () => { }, enableSave: boolean = true, token?: string) => {
        try {
            let config = {}
            if (token) {
                config = {
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        Authorization: 'Bearer ' + token,
                    },
                };
            }


            let response: any = {}
            setisSongsLoading(true)
            const localSongsLsst = await getItem(`${ASYNC_KEYS.SONGS}${id}`, [])

            if (localSongsLsst?.length > 0) {
                response = {
                    status: 200,
                    data: localSongsLsst
                }
            } else {
               
                response = await get(BASE_URL + `/player-mobile/devices/playlists/songs/${id}`,
                    token ? config : undefined
                ) as any;
                if (response.status === 200 && response.data) {
                    await setItem(`${ASYNC_KEYS.SONGS}${id}`, response.data)
                }
            }

            const localSongs = await getItem(ASYNC_KEYS.SONGS, [])
            const localRes = getUniqueItems(localSongs)
            await decryptSongsFolder(id)
            setTimeout(async () => {
                const files = await getFilesFromFolder(id, true)

                if (response.status === 200 && response.data) {
                    let rawList = response.data
                    rawList = shuffleArray(rawList)
                    let mList = await getTrackPlayerList(rawList, files, id)
                    mList = shuffleArray(mList)

                    if (enableSave == true) { setPlayListSongs(rawList) }
                    callBack(mList)
                    setisSongsLoading(false)
                    return mList
                } else {
                    let filtered = localRes.filter((song: ISong) => song.PlaylistID == id)
                    filtered = shuffleArray(filtered)

                    let mList = await getTrackPlayerList(filtered, files, id)
                    mList = shuffleArray(mList)

                    if (enableSave == true) { setPlayListSongs(filtered) }
                    callBack(mList)
                    setisSongsLoading(false)
                    return mList
                }
            }, 0);

        } catch (error) {
            setTimeout(async () => {
                const localSongs = await getItem(ASYNC_KEYS.SONGS, [])
                const localRes = getUniqueItems(localSongs)
                const files = await getFilesFromFolder(id, true)
                const filtered = localRes.filter((song: ISong) => song.PlaylistID == id)
                const mList = await getTrackPlayerList(filtered, files, id)
                if (enableSave == true) { setPlayListSongs(filtered) }
                callBack(mList)
                setisSongsLoading(false)
                return mList
            }, 0);
        }
    }

    const getPlayListSongsInitial = async (id: string, callBack: Function = () => { }, enableSave: boolean = true, token?: string) => {
        try {
            let config = {}
            if (token) {
                config = {
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        Authorization: 'Bearer ' + token,
                    },
                };
            }
            setisLoading(true)

            let response: any = {}

            const localSongsLsst = await getItem(`${ASYNC_KEYS.SONGS}${id}`, [])

            if (localSongsLsst?.length > 0) {
                response = {
                    status: 200,
                    data: localSongsLsst
                }
            } else {
                response = await get(BASE_URL + `/player-mobile/devices/playlists/songs/${id}`,
                    token ? config : undefined
                ) as any;
                if (response.status === 200 && response.data) {
                    await setItem(`${ASYNC_KEYS.SONGS}${id}`, response.data)
                }
            }

            const localSongs = await getItem(ASYNC_KEYS.SONGS, [])
            const localRes = getUniqueItems(localSongs)
            if (response.status === 200 && response.data) {
                const rawList = response.data
                const mList = rawList.map((song: ISong) => {
                    return {
                        ...song,
                        title: song.Title,
                        artist: song.Artist,
                        artwork: song.songImg,
                        url: song.songUrl,
                        id: song.ID
                    }
                })

                if (enableSave == true) { setPlayListSongs(mList) }
                callBack(mList)
                return mList
            } else {
                const filtered = localRes.filter((song: ISong) => song.PlaylistID == id)
                const mList = filtered.map((song: ISong) => {
                    return {
                        ...song,
                        title: song.Title,
                        artist: song.Artist,
                        artwork: song.songImg,
                        url: song.songUrl,
                        id: song.ID
                    }
                })
                if (enableSave == true) { setPlayListSongs(mList) }
                callBack(mList)
                setisLoading(false)
                Toast.show({
                    type: ALERT_TYPES.WARNING,
                    text1: ALERT_HEADER.DANGER,
                    text2: 'An error occurred!',
                });
                return mList
            }


        } catch (error) {
            const localSongs = await getItem(`${ASYNC_KEYS.SONGS}${id}`, [])
            const localRes = getUniqueItems(localSongs)
            const mList = localRes.map((song: ISong) => {
                return {
                    ...song,
                    title: song.Title,
                    artist: song.Artist,
                    artwork: song.songImg,
                    url: song.songUrl,
                    id: song.ID
                }
            })
            if (enableSave == true) { setPlayListSongs(mList) }
            callBack(mList)
            setisLoading(false)
            Toast.show({
                type: ALERT_TYPES.WARNING,
                text1: ALERT_HEADER.WARNING,
                text2: 'An error occurred!',
            });
            return mList
        }
    }


    const refreshList = async (callBack: Function = () => { }) => {
        try {
            const token = false
            callBack(true)
            let config = {}
            if (token) {
                config = {
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        Authorization: 'Bearer ' + token,
                    },
                };
            }
            const playListData = await get(BASE_URL + '/player-mobile/devices/playlists',
                token ? config : undefined
            ) as any;

            if (playListData.status === 200 && playListData.data) {
                setPlayLists(playListData.data)
                await setItem(ASYNC_KEYS.PLAY_LISTS, playListData.data)
            }

            const agendes = await post(BASE_URL + '/player-mobile/agenda/get-agenda',
                {
                    AgendaID: user?.AgendaId
                },
                token ? config : undefined
            ) as any;

            if (agendes.status === 200 && agendes.data.agandes) {
                setAgendes(agendes.data.agandes)
                await setItem(ASYNC_KEYS.AGENDE, agendes.data.agandes)
            }


            // CHECKING AND MERGING AVAILABLE DATA

            let playLists

            if (playListData.status === 200 && playListData?.data &&
                agendes.status === 200 && agendes?.data?.agandes) {
                playLists = mergeAgendePlaylist(playListData?.data, agendes?.data?.agandes)
            } else if (playListData.status === 200 && playListData?.data &&
                agendes.status != 200 && !agendes?.data?.agandes) {
                playLists = mergeAgendePlaylist(playListData?.data, [])
            } else if (playListData.status != 200 && !playListData?.data &&
                agendes.status === 200 && agendes?.data?.agandes) {
                playLists = mergeAgendePlaylist([], agendes?.data?.agandes)
            } else {
                playLists = mergeAgendePlaylist([], [])
            }

            callBack(false)


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


            return true

        } catch (error) {
            Toast.show({
                type: ALERT_TYPES.WARNING,
                text1: ALERT_HEADER.WARNING,
                text2: 'An error occurred!',
            });
            callBack(false)
            return false

        }
    }


    const getSongServer = async (list: IPlayList[]) => {
        return new Promise(async (resolve, reject) => {
            try {
                for (let index = 0; index < list.length; index++) {
                    const response = await get(BASE_URL + `/player-mobile/devices/playlists/songs/${list[index]?.ScenarioID}`) as any;
                    if (response.status === 200 && response.data) {
                        await setItem(`${ASYNC_KEYS.SONGS}${list[index]?.ScenarioID}`, response.data)
                    }
                }
                resolve(true)
            } catch (error) {
                resolve(true)
            }

        })
    }

    return {
        getAgenda,
        getPlayLists,
        getPlayListSongs,
        isLoading,
        isSongsLoading,
        getPlayListSongsInitial,
        refreshList,
        getSongServer
    };
};

export default useSongs;
