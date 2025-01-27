import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import { COLORS, COMMON_STYLES, hp, wp } from '../assets/styles/styleGuide'
import { ISong } from '../models/app'
import { PLSIId, getFileExists } from '../utils/myUtils'
import AntDesign from 'react-native-vector-icons/AntDesign'
import TrackPlayer, { useActiveTrack, usePlaybackState, State } from 'react-native-track-player'
import { decryptSong } from '../services/crypt'
import { appStateSelectors, useApp } from '../states/app'

interface TrackItemProps {
    item: ISong
}

const TrackItem: React.FC<TrackItemProps> = ({ item }: TrackItemProps) => {
    const [isDownloaded, setisDownloaded] = useState(false)
    const activeTrack = useActiveTrack()
    const playbackState = usePlaybackState();
    const refreshState = useApp(appStateSelectors.refreshState)

    const checkFile = () => {
        const filtered = refreshState[item?.PlaylistID]?.filter((x: any) => x.fileName == `${item.ID}.mp3`)
        if (filtered?.length > 0) {
            return true
        } else {
            return false
        }
    }

    return (
        <TouchableOpacity style={styles.main} >

            <ImageBackground
                source={{ uri: item.songImg }}
                style={styles.cover}
                imageStyle={{
                    borderRadius: 5,
                }}
            >
                {
                    checkFile() == false &&
                    <View style={styles.opacityBackground}>
                        <AntDesign
                            name='clouddownload'
                            color={COLORS.WHITE}
                            size={25}
                        />
                    </View>
                }

                {
                    (playbackState.state == State.Playing &&
                        PLSIId(activeTrack?.id || "").songId == item.ID) &&
                    <View style={styles.opacityBackground}>
                        <Image
                            source={require('../assets/animations/equalizer.gif')}
                            style={styles.image}
                        />
                    </View>

                }

            </ImageBackground>
            <View >
                <Text style={[styles.title]}>{item.Title}</Text>
                <Text style={[styles.artist]}>{`${item.Artist} (${item.Album})`}</Text>
            </View>
        </TouchableOpacity>
    )
}

export default TrackItem

const styles = StyleSheet.create({
    main: {
        width: '100%',
        borderBottomWidth: 0.8,
        borderColor: COLORS.GREY,
        flexDirection: 'row',
        // justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 5,
    },
    title: {
        ...COMMON_STYLES.h2,
        fontSize: hp(1.6),
        width: wp(100) - (40 + wp(8))
    },
    artist: {
        ...COMMON_STYLES.h4,
        fontSize: hp(1.4),
        width: wp(100) - (40 + wp(8))
    },
    cover: {
        width: 40,
        height: 40,
        borderRadius: 5,
        marginHorizontal: wp(3),
    },
    opacityBackground: {
        flex: 1,
        borderRadius: 5,
        backgroundColor: "rgba(0,0,0,1)",
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        width: '80%',
        height: '80%',
        resizeMode: 'contain'
    }

})