import React, { useEffect, useRef, useState } from 'react';
import { AppState, Alert, FlatList, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import TrackPlayer, {
    Capability, usePlaybackState, useActiveTrack, State
} from 'react-native-track-player';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { COLORS, COMMON_STYLES, hp, wp } from '../assets/styles/styleGuide';
import { AppHeader, Layout, Loader, PlayListItem, PlayListItemSecondary, SongPlayer, Spacer, SubsExpiredModal, TrackItem } from '../components';
import useSongs from '../hooks/songs';
import { appStateSelectors, useApp } from '../states/app';
import { PLSIId, getAllDownloaded, isSubsExpired, isTab, mergeAgendePlaylist, tabHp } from '../utils/myUtils';
import { decryptSong, hiddenPath } from '../services/crypt';
import SoundPlayer from 'react-native-sound-player'

const Home: React.FC = () => {
    const carouselRef = useRef(null)
    const scrollViewRef = useRef(null)
    const [pageIndex, setpageIndex] = useState(0)
    const [PLIST, setPLIST] = useState<any>([])
    const { getPlayLists, getPlayListSongs, isLoading, isSongsLoading } = useSongs()
    const playLists = useApp(appStateSelectors.playLists)
    const agendes = useApp(appStateSelectors.agendes)
    const enableAgende = useApp(appStateSelectors.enableAgende)
    const user = useApp(appStateSelectors.user)
    const playListSongs = useApp(appStateSelectors.playListSongs)
    const secondaryLayout = useApp(appStateSelectors.secondaryLayout)
    const setRefreshState = useApp(appStateSelectors.setRefreshState)
    const MERGED_LIST = mergeAgendePlaylist(playLists, agendes)
    const [isExpiryModelVisible, setisExpiryModelVisible] = useState(false)
    const playbackState = usePlaybackState();
    const activeTrack = useActiveTrack()

    useEffect(() => {
        const list = mergeAgendePlaylist(playLists, agendes)
        getAllDownloadedFiles(list)
        if (list.length >= 2) {
            [list[0], list[1]] = [list[1], list[0]];
        }

        setPLIST(list)
    }, [playLists, agendes])

    // AGENDA

    useEffect(() => {
        if (enableAgende) {
            const data = agendes
            const currentDateTime = new Date();

            // Filter items where current datetime is between start and end datetime
            const filteredItems: any = data.filter(item => {
                const startDate = new Date(item.start);
                const endDate = new Date(item.end);
                return startDate <= currentDateTime && currentDateTime <= endDate;
            });

            if (filteredItems?.length > 0) {
                getPlayListSongs(filteredItems[0]?.ScenarioID, setupPlayList, true)
            }

        }

    }, [playLists, agendes])


    // PLAY PLAYLIST AOTOMATICALLY
    useEffect(() => {
        const MERGEDLIST = mergeAgendePlaylist(playLists, agendes)
        if (playbackState.state != State.Playing && MERGEDLIST?.length > 0) {
            handleSelectPlayList(MERGEDLIST[0]?.ScenarioID)
        }
    }, [])



    // STOP PLAYING WHEN APP IS IN BACKGROUND

    useEffect(() => {
        const subscription: any = AppState.addEventListener(Platform.OS == 'ios' ? 'change' : 'blur', async (state) => {
            if (Platform.OS == 'ios') {
                if (state != 'active') {
                    await TrackPlayer.pause();
                }
            } else {
                await TrackPlayer.pause();
            }
        })

        return () => {
            subscription.remove();
        };
    }, [])



    const setupPlayList = async (list: any) => {
        try {
            await TrackPlayer.reset()
            await TrackPlayer.updateOptions({
                capabilities: [
                    Capability.Play,
                    Capability.Stop,
                    Capability.Pause,
                    Capability.SeekTo,
                    Capability.Skip,
                ],
                compactCapabilities: [
                    Capability.Play,
                    Capability.Stop,
                    Capability.Pause,
                    Capability.SeekTo,
                    Capability.Skip,
                ],
                notificationCapabilities: [
                    Capability.Play,
                    Capability.Stop,
                    Capability.Pause,
                    Capability.SeekTo,
                    Capability.Skip,
                ],
            });
            await TrackPlayer.setQueue(list);
            await TrackPlayer.seekTo(0);
            await TrackPlayer.play();
        } catch (error) {
            console.log('setupPlayList Error : ', error);
        }
    }

    const handleSelectPlayList = async (id: string) => {
        getPlayListSongs(id, setupPlayList, true)
    }

    const toNextPage = () => {
        if (PLIST.length > 8) {
            const limit = Math.floor(PLIST.length / 4) - 3
            if (pageIndex < limit) {
                let screenIndex = pageIndex;
                setpageIndex(pageIndex + 1)
                screenIndex += 1;
                scrollViewRef.current?.scrollTo({ x: (screenIndex * (wp(100) - 140)), animated: true });

            }
        }
    };

    const toPrevPage = () => {
        if (pageIndex > 0) {
            let screenIndex = pageIndex;
            setpageIndex(pageIndex - 1)
            screenIndex -= 1;
            scrollViewRef.current?.scrollTo({ x: (screenIndex * (wp(100) - 140)), animated: true });
        }
    };

    // CHECK IF THE USER's SUBSCRIPTION HAS EXPIRED
    useEffect(() => {
        const intervalId = setInterval(async () => {
            try {
                if (isExpiryModelVisible == false) {
                    const isExpired = isSubsExpired(user?.expiresIn)
                    if (isExpired) {
                        await TrackPlayer.stop();
                        setisExpiryModelVisible(true)
                    }
                }
            } catch (error) {
                console.log("SUBSCRIPTION ==>>", error);
            }

        }, 60 * 1000);

        return () => clearInterval(intervalId);
    }, [])

    // CHECK FOR SONGS IN LOCAL STORAGE
    useEffect(() => {
        const intervalId = setInterval(async () => {
            try {
                const list = mergeAgendePlaylist(playLists, agendes)
                if (list?.length > 0) {
                    getAllDownloadedFiles(list)
                }
            } catch (error) {
                console.log("REFRESH ==>>", error);
            }

        }, 5 * 1000);

        return () => clearInterval(intervalId);

    }, [])

    const getAllDownloadedFiles = async (list: any) => {
        try {
            const data = await getAllDownloaded(list)
            
            setRefreshState(data)
            if (playbackState.state == State.Playing && playListSongs?.length > 0) {
                if (activeTrack?.id?.includes(playListSongs[0]?.PlaylistID)) {
                    const queue = await TrackPlayer.getQueue()
                    data[playListSongs[0]?.PlaylistID]?.forEach(async (downloadedItem: any) => {
                        const fileName = downloadedItem?.fileName
                        const filtered = queue.filter((quequeItem: any) => fileName == `${PLSIId(quequeItem?.id)?.songId}.mp3`)
                        if (filtered?.length == 0) {
                            const SongIdFromFileName = fileName.split('.')[0]
                            const songFilter = playListSongs?.find(x => x?.ID == SongIdFromFileName)
                            if (songFilter) {
                                const res = await decryptSong(songFilter?.PlaylistID, songFilter.ID) as string

                                await TrackPlayer.add({
                                    id: songFilter.ID,
                                    url: res,
                                    title: songFilter?.Title,
                                    artist: songFilter?.Artist,
                                    artwork: songFilter?.songImgSmall
                                })
                            }
                        }
                    })

                }
            }
        } catch (error) {
            console.log("getAllDownloadedFiles ==>>", error);
        }
    }

    return (
        <Layout fixed={true}>
            <AppHeader />
            {
                secondaryLayout ?
                    <>
                        {
                            isTab() ?
                                <View style={styles.TabView}>
                                    <View style={styles.scrollBtnContainer}>
                                        <TouchableOpacity
                                            activeOpacity={0.8}
                                            onPress={() => toPrevPage()}
                                            style={styles.scrollBtn}>
                                            <AntDesign
                                                name='caretleft'
                                                size={50}
                                                color={COLORS.BLACK}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                    <ScrollView
                                        ref={scrollViewRef}
                                        horizontal
                                        // pagingEnabled={true}
                                        showsHorizontalScrollIndicator={false}
                                        directionalLockEnabled={true}
                                        alwaysBounceVertical={false}

                                    >

                                        <FlatList
                                            contentContainerStyle={{ alignSelf: 'flex-start' }}
                                            numColumns={Math.ceil(MERGED_LIST.length / 2)}
                                            showsVerticalScrollIndicator={false}
                                            showsHorizontalScrollIndicator={false}
                                            data={PLIST}
                                            renderItem={({ item, index }) => {
                                                return (
                                                    <PlayListItemSecondary
                                                        item={item}
                                                        onSelect={() => { handleSelectPlayList(item.ScenarioID) }}
                                                    />

                                                )
                                            }}
                                        />

                                    </ScrollView>
                                    <View style={styles.scrollBtnContainer}>
                                        <TouchableOpacity
                                            activeOpacity={0.8}
                                            onPress={() => toNextPage()}
                                            style={styles.scrollBtn}>
                                            <AntDesign
                                                name='caretright'
                                                size={50}
                                                color={COLORS.BLACK}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                :
                                <FlatList
                                    contentContainerStyle={{ paddingBottom: 110 }}
                                    style={{ alignSelf: 'center' }}
                                    numColumns={2}
                                    showsVerticalScrollIndicator={false}
                                    showsHorizontalScrollIndicator={false}
                                    data={PLIST}
                                    renderItem={({ item, index }) => {
                                        return (
                                            <PlayListItemSecondary
                                                item={item}
                                                onSelect={() => { handleSelectPlayList(item.ScenarioID) }}
                                            />
                                        )
                                    }}
                                />
                        }
                    </>
                    :
                    <>
                        <View style={styles.playlist}>
                            <Carousel
                                ref={carouselRef}
                                data={PLIST}
                                layout='default'
                                renderItem={({ item }) => (
                                    <PlayListItem
                                        item={item}
                                        onSelect={() => { handleSelectPlayList(item.ScenarioID) }}
                                    />
                                )}
                                sliderWidth={wp(100)}
                                itemWidth={isTab() ? wp(47.5) : wp(85)}
                                loop
                                autoplay={false}
                                onSnapToItem={(item) => { }}
                            />

                        </View>

                        <Text style={styles.tracks}>Tracks</Text>
                        {/* TRACKS */}
                        <FlatList
                            data={playListSongs}
                            renderItem={({ item }) => (
                                <TrackItem
                                    item={item}
                                />
                            )}
                            ListFooterComponent={() => (<Spacer height={100} />)}
                        />
                    </>
            }
            <View style={styles.absoluteContainer}>
                <SongPlayer />
            </View>
            <Loader isLoading={isSongsLoading} />
            <SubsExpiredModal isLoading={isExpiryModelVisible} />
        </Layout>
    )
}

export default Home

const styles = StyleSheet.create({
    playlist: {
        borderBottomWidth: 0.8,
        borderColor: COLORS.GREY,
        height: isTab() ? hp(30) + 30 : hp(28) + 30,
        maxHeight: 400,
        paddingVertical: 15
    },
    tracks: {
        ...COMMON_STYLES.h3,
        paddingHorizontal: wp(4),
        marginVertical: 10,
        color: COLORS.BLACK
    },
    absoluteContainer: {
        position: 'absolute',
        width: '90%',
        maxWidth: 600,
        alignItems: 'center',
        bottom: Platform.OS == 'ios' ? 20 : 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,

        elevation: 10,
        alignSelf: 'center',
        borderRadius: 25
    },
    gridView: {
        flex: 1,
        marginBottom: isTab() ? 100 : 0,
    },
    TabView: {
        flex: 1,
        marginBottom: 110,
        flexDirection: 'row',
        justifyContent: 'space-between',
        // alignItems: 'center',
    },
    scrollBtn: {
        marginHorizontal: 10
    },
    scrollBtnContainer: {
        height: '100%',
        paddingTop: tabHp(35)

    }
})