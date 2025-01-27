import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import TrackPlayer from 'react-native-track-player';
import { LoaderRoot } from './src/components';
import Root from './src/navigation/root';

const App = () => {

  useEffect(() => {
    setupPlayer()
  }, [])

  const setupPlayer = async () => {
    try {
      await TrackPlayer.setupPlayer({
        waitForBuffer: true,
     });
    } catch (e) {
      console.log('Configure TrackPlayer:', e);
    }
  };

  return (
    <SafeAreaProvider>
      <Root />
      <Toast />
      <LoaderRoot />
    </SafeAreaProvider>
  )
}

export default App
