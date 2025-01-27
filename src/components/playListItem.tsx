import React, { useState, useEffect } from 'react'
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import DeviceInfo from 'react-native-device-info'
import {
    State,
    usePlaybackState
} from 'react-native-track-player'
import Entypo from 'react-native-vector-icons/Entypo'
import { COLORS, FONTS, hp } from '../assets/styles/styleGuide'
import { IPlayList, ISong } from '../models/app'
import { appStateSelectors, useApp } from '../states/app'
import EqualizerCover from './equalizerCover'
import { getFilesFromFolder } from '../utils/myUtils'
import DownlaodingCover from './downlaodingCover'

interface PlayListItemProps {
    item: IPlayList;
    onSelect: Function;
}

const PlayListItem: React.FC<PlayListItemProps> =
    ({ item, onSelect }: PlayListItemProps) => {
        const [isCoverError, setisCoverError] = useState(false)
        const playListSongs = useApp(appStateSelectors.playListSongs)
        const refreshState = useApp(appStateSelectors.refreshState)
        const playbackState = usePlaybackState();

        const isPlayListActive = () => {
            const filtered = playListSongs.filter((song: ISong) => song.PlaylistID == item?.ScenarioID)
            if (playbackState.state == State.Playing && filtered.length > 0) {
                return true
            } else {
                return false
            }
        }

        return (
            <ImageBackground
                source={item?.Cover ? isCoverError ? require('../assets/images/playlist.png') : { uri: item?.Cover } : require('../assets/images/playlist.png')}
                onError={() => setisCoverError(true)}
                style={styles.main}
                imageStyle={{ borderRadius: 10 }}
            >
                <View style={styles.conatiner}>
                    <Text style={styles.title}>{item.ScenarioName}{item?.ScenarioID}</Text>
                    <Text style={styles.songs}>{`Songs: ${refreshState[item?.ScenarioID]?.length >= Number(item?.ScenarioSongs)
                        ? Number(item?.ScenarioSongs) : refreshState[item?.ScenarioID]?.length}/${item?.ScenarioSongs || "N/A"}`}</Text>
                </View>
                <View style={styles.btnContainer}>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={styles.btn}
                        onPress={() => onSelect()}
                    >
                        <Entypo
                            name={'controller-play'}
                            color={COLORS.BLACK}
                            size={28}

                        />
                    </TouchableOpacity>

                    {
                        (refreshState[item?.ScenarioID]?.length < Number(item?.ScenarioSongs)) &&
                        < Image
                            source={require('../assets/animations/downloading.gif')}
                            style={styles.image}
                        />
                    }
                </View>

                {/* {
                    (refreshState[item?.ScenarioID]?.length < 1) &&
                    <DownlaodingCover />
                } */}

                {/* EQUALIZER */}
                {isPlayListActive() &&
                    <EqualizerCover />}
            </ImageBackground>
        )
    }

export default PlayListItem

const styles = StyleSheet.create({
    main: {
        width: '100%',
        height: DeviceInfo.isTablet() ? hp(30) : hp(28),
        backgroundColor: COLORS.WHITE,
        resizeMode: 'cover',
        borderRadius: 10
    },
    conatiner: {
        flex: 1,
        paddingHorizontal: '5%',
        paddingVertical: 15
    },
    title: {
        fontFamily: FONTS.POPPINS_700,
        color: COLORS.PRIMARY,
        fontSize: 18,
        backgroundColor: COLORS.WHITE,
        borderRadius: 5,
        width: '80%',
        paddingHorizontal: 2,
    },
    songs: {
        fontFamily: FONTS.POPPINS_500,
        color: COLORS.PRIMARY,
        fontSize: 14,
        backgroundColor: COLORS.WHITE,
        borderRadius: 5,
        paddingHorizontal: 2,
        width: '80%',
        marginTop: 5
    },
    btnContainer: {
        paddingHorizontal: '5%',
        paddingBottom: 15,
    },
    btn: {
        width: 45,
        height: 45,
        borderRadius: 25,
        backgroundColor: COLORS.WHITE,
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        width: 65,
        height: 65,
        position: 'absolute',
        top: -10,
        right: '5%',
        resizeMode: 'contain'
    }
})