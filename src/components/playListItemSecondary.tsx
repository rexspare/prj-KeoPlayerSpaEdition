import React, { useState, useEffect } from 'react'
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import {
    State,
    usePlaybackState
} from 'react-native-track-player'
import Entypo from 'react-native-vector-icons/Entypo'
import { COLORS, FONTS, wp } from '../assets/styles/styleGuide'
import { IPlayList, ISong } from '../models/app'
import { appStateSelectors, useApp } from '../states/app'
import { getFilesFromFolder, isTab, tabHp } from '../utils/myUtils'
import EqualizerCover from './equalizerCover'
import DownlaodingCover from './downlaodingCover'

interface PlayListItemProps {
    item: IPlayList;
    onSelect: Function;
}

const PlayListItemSecondary: React.FC<PlayListItemProps> =
    ({ item, onSelect }: PlayListItemProps) => {
        const [isCoverError, setisCoverError] = useState(false)
        const refreshState = useApp(appStateSelectors.refreshState)
        const playListSongs = useApp(appStateSelectors.playListSongs)
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
            <View style={styles.mainContainer}>
                <ImageBackground
                    source={item?.Cover ? isCoverError ? require('../assets/images/playlist.png') : { uri: item?.Cover } : require('../assets/images/playlist.png')}
                    onError={() => setisCoverError(true)}
                    style={styles.main}
                    imageStyle={{ borderRadius: 10 }}
                >


                    <View style={styles.btnContainer}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={styles.btn}
                            onPress={() => onSelect()}
                        >
                            <Entypo
                                name={'controller-play'}
                                color={COLORS.BLACK}
                                size={isTab() ? tabHp(4) : 20}

                            />
                        </TouchableOpacity>

                        {
                            (refreshState[item?.ScenarioID]?.length < Number(item?.ScenarioSongs)) &&
                            <Image
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
                <View style={styles.conatiner}>
                    <Text style={styles.title} numberOfLines={2}>{item.ScenarioName}</Text>
                    <Text style={styles.songs}>{`Songs: ${refreshState[item?.ScenarioID]?.length >= Number(item?.ScenarioSongs)
                            ? Number(item?.ScenarioSongs) : refreshState[item?.ScenarioID]?.length}/${item?.ScenarioSongs || "N/A"}`}</Text>
                </View>
            </View>

        )
    }

export default PlayListItemSecondary

const styles = StyleSheet.create({
    mainContainer: {
        marginHorizontal: isTab() ? wp(1) : wp(1.5),
        marginTop: isTab() ? wp(1) : wp(3)
    },
    main: {
        backgroundColor: COLORS.WHITE,
        resizeMode: 'cover',
        borderRadius: 10,
        justifyContent: 'flex-end',
        width: isTab() ? tabHp(30) : wp(45),
        height: isTab() ? tabHp(30) : wp(45),
    },
    conatiner: {
        flex: 1,
        width: isTab() ? tabHp(30) : wp(45)
    },
    title: {
        fontFamily: FONTS.POPPINS_500,
        color: COLORS.PRIMARY,
        fontSize: 14,
        paddingHorizontal: 2,
    },
    songs: {
        fontFamily: FONTS.POPPINS_400,
        color: COLORS.PRIMARY,
        fontSize: 11,
        backgroundColor: COLORS.WHITE,
        borderRadius: 5,
        paddingHorizontal: 2,
        width: '80%',
        marginTop: -4
    },
    btnContainer: {
        paddingHorizontal: '5%',
        marginBottom: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    btn: {
        width: isTab() ? tabHp(6) : 30,
        height: isTab() ? tabHp(6) : 30,
        borderRadius: 30,
        backgroundColor: COLORS.WHITE,
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        width: isTab() ? tabHp(7) : 40,
        height: isTab() ? tabHp(7) : 40,
    },

})