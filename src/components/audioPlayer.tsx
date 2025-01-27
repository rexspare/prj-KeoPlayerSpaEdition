import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import SoundPlayer from 'react-native-sound-player'

const AudioPlayer = ({ songs }: any) => {
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        // Load the initial song
        loadSong(currentSongIndex);
    }, []);

    const loadSong = async (index) => {
        try {
            await SoundPlayer.loadUrl(songs[index].url);
            setIsPlaying(true);
        } catch (error) {
            console.error('Error loading song:', error);
        }
    };

    const playPauseToggle = () => {
        if (isPlaying) {
            SoundPlayer.pause();
        } else {
            SoundPlayer.play();
        }
        setIsPlaying(!isPlaying);
    };

    const playNext = () => {
        const nextIndex = (currentSongIndex + 1) % songs.length;
        setCurrentSongIndex(nextIndex);
        loadSong(nextIndex);
    };

    const playPrevious = () => {
        const prevIndex = (currentSongIndex - 1 + songs.length) % songs.length;
        setCurrentSongIndex(prevIndex);
        loadSong(prevIndex);
    };

    return (
        <View>
            <Text>{'songs[currentSongIndex].ID'}</Text>
            <Button title={isPlaying ? 'Pause' : 'Play'} onPress={playPauseToggle} />
            <Button title="Next" onPress={playNext} />
            <Button title="Previous" onPress={playPrevious} />
        </View>
    );
};

export default AudioPlayer;
