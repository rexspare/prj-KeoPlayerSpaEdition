import Slider from '@react-native-community/slider';
import React, { useState ,useEffect} from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import TrackPlayer, {
    State,
    usePlaybackState,
    useProgress
} from 'react-native-track-player';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import { COLORS, FONTS } from '../assets/styles/styleGuide';
import { isTab } from '../utils/myUtils';


const SongPlayer: React.FC = ({
    currentIndex,
    onChange = () => { }
}: any) => {

    const [currentSongIndex, setCurrentSongIndex] = useState(currentIndex);
    const [isPlaying, setIsPlaying] = useState(false);
    const progress = useProgress();
    const playbackState = usePlaybackState();
    const [isVolumeRampUpComplete, setIsVolumeRampUpComplete] = useState(false);


    useEffect(() => {
        const adjustVolume = async () => {
          const rampUpDuration = 5; // Adjust as needed
          const fadeOutDuration = 5; // Adjust as needed
          const fadeOutStart = progress.duration - fadeOutDuration;
      
          if (playbackState.state === State.Playing) {
            if (progress.position < rampUpDuration) {
              // Volume ramp-up in the first 10 seconds
              const volume = (progress.position / rampUpDuration) * 1.0; // Adjust 1.0 to your maximum volume
              await TrackPlayer.setVolume(volume);
            } else if (
              progress.position >= fadeOutStart &&
              progress.position <= progress.duration
            ) {
              // Volume fade-out in the last 10 seconds
              const fadeOutProgress =
                progress.position - fadeOutStart > 0
                  ? progress.position - fadeOutStart
                  : 0;
              const volume = 1.0 - fadeOutProgress / fadeOutDuration;
              await TrackPlayer.setVolume(volume < 0 ? 0 : volume);
            } else {
              // Volume remains constant after initial ramp-up and before fade-out
              const constantVolume = 1.0; // Adjust as needed
              await TrackPlayer.setVolume(constantVolume);
            }
          }
        };
      
        adjustVolume();
      }, [progress.position, progress.duration, playbackState.state]);
      

    const format = (seconds: any) => {
        let mins = parseInt(seconds / 60)
            .toString()
            .padStart(2, '0');
        let secs = (Math.trunc(seconds) % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    };

    const togglePlayback = async () => {
        if (playbackState.state == State.Playing) {
            await TrackPlayer.pause();
        } else {
            await TrackPlayer.play();
        }
    };

    const skipToPrevious = async () => {
        // if (currentSongIndex > 0) {
        await TrackPlayer.skipToPrevious();
        setCurrentSongIndex(currentSongIndex - 1);
        onChange(currentSongIndex - 1);
        // }
    };

    const skipToNext = async () => {
        // if (currentSongIndex < songsList.length - 1) {
        await TrackPlayer.skipToNext();
        setCurrentSongIndex(currentSongIndex + 1);
        onChange(currentSongIndex + 1);
        // }
    };

    const restartAudio = async () => {
        await TrackPlayer.seekTo(0);
    };

    return (
        <View style={styles.main} >
            {/* <Text style={styles.title}>Song Title</Text> */}
            <View style={styles.sliderContainer}>
                <Slider
                    style={{
                        width: '100%',
                        height: 20,
                        alignSelf: 'center',
                    }}
                    value={progress.position}
                    minimumValue={0}
                    maximumValue={progress?.duration}
                    minimumTrackTintColor={COLORS.BLACK}
                    maximumTrackTintColor={COLORS.GREY}
                    thumbTintColor={COLORS.PRIMARY}
                    onSlidingComplete={async value => {
                        const seconds = Math.floor(value);
                        await TrackPlayer.seekTo(seconds);
                    }}

                />
                <View style={styles.timeContainer}>
                    <Text style={styles.timeTxt}>{format(progress?.position)}</Text>
                    <Text style={styles.timeTxt}>{format(progress?.duration)}</Text>
                </View>
            </View>
            <View style={styles.row}>
                <TouchableOpacity
                    onPress={() => skipToPrevious()}
                    activeOpacity={0.8}
                    style={styles.btn}>
                    <AntDesign
                        name='stepbackward'
                        color={COLORS.PRIMARY}
                        size={16}
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => togglePlayback()}
                    activeOpacity={0.8}
                    style={[styles.btn, styles.btn2]}>
                    <Feather
                        name={playbackState.state == State.Playing ? 'pause' : 'play'}
                        color={COLORS.PRIMARY}
                        size={20}
                        style={{
                            left: playbackState.state == State.Playing ? 0 : 2
                        }}
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => skipToNext()}
                    activeOpacity={0.8}
                    style={styles.btn}>
                    <AntDesign
                        name='stepforward'
                        color={COLORS.PRIMARY}
                        size={16}
                    />
                </TouchableOpacity>

            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    main: {
        width: '100%',
        maxWidth: 600,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: COLORS.BACKGROUND,
        paddingHorizontal: '4%',
        paddingVertical: 6,
        borderRadius: 25
    },
    sliderContainer: {
        flex: 1,
    },
    title: {
        color: COLORS.BLACK,
        fontFamily: FONTS.POPPINS_500,
        fontSize: 14
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    btn: {
        backgroundColor: COLORS.WHITE,
        width: isTab() ? 32 : 28,
        height: isTab() ? 32 : 28,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,

        elevation: 6,
    },
    btn2: {
        width: isTab() ? 45 : 35,
        height: isTab() ? 45 : 35,
        marginHorizontal: 5
    },
    timeTxt: {
        color: COLORS.BLACK,
        fontFamily: FONTS.POPPINS_400,
        fontSize: 10
    },
    timeContainer: {
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignSelf: 'center',
    }
})

export default React.memo(SongPlayer);
