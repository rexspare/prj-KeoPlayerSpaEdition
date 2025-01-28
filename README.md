
# KEO SPA PLAYER

KEO SPA PLAYER is a custom audio player designed specifically for spas and similar spaces. It allows users to download encrypted audio tracks, decrypt them, and play them through the app. The songs and playlists are retrieved via an API based on the logged-in user's preferences. The app is designed to work both online and offline, allowing users to enjoy their music even without an internet connection.  

The simple yet effective UI shows the downloaded playlist, where users can play any song they wish. The app uses React Native FS to download the songs and a custom native module to decrypt the songs for playback.


## 🚀 Features

#### 🎵 Audio Song Player
- Play encrypted songs that are downloaded to the device's file system.
- Simple and intuitive UI to navigate through the playlist.
- Secure decryption and playback of songs via a custom native module.

#### 🌐 Online and Offline Support
- Retrieve playlists and songs from the API while connected to the internet.
- Enjoy your downloaded songs even when offline by decrypting and playing them.

#### 🔒 Secure Song Decryption
- Songs are encrypted for security and decrypted on the fly for playback using a native module.
- All downloaded songs are stored securely on the device's file system.

#### 📱 Playlist Management
- Play any song from the downloaded playlist with ease.
- Users can see and navigate through their playlists, making song selection quick and convenient.
## 📦 Technology Stack
- **Frontend:** React Native for mobile development.
- **File System:** React Native FS to handle downloading and managing audio files.
- **Sound Playback:** React Native Sound audio playback.
- **API:** A custom API to retrieve song playlists based on user preferences (authentication may be required for user-specific playlists).
- **Encryption/Decryption:** Custom native module for encrypting and decrypting audio files.
- **Offline Support:** Local file storage for offline playback of decrypted songs.
