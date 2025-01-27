import { passwordStrength } from 'check-password-strength';
import {
    Alert,
    Linking,
    PermissionsAndroid,
    Platform
} from 'react-native';
import ReactNativeBlobUtil from "react-native-blob-util";
import DeviceInfo from 'react-native-device-info'
import { hp } from '../assets/styles/styleGuide';
import { IAgenda, IPlayList, ISong } from '../models/app';
import RNFS from 'react-native-fs';

const getGreetings = () => {
    const currentDate = new Date();
    const currentHour = currentDate.getHours();
    let greeting;
    if (currentHour >= 5 && currentHour < 12) {
        greeting = 'Good morning!';
    } else if (currentHour >= 12 && currentHour < 18) {
        greeting = 'Good afternoon!';
    } else if (currentHour >= 18 && currentHour < 22) {
        greeting = 'Good evening!';
    } else {
        greeting = 'Good night!';
    }
    return greeting
}

/**
 * EMAIL VAILDATION
 * **/
const vaildateEmail = (text: string) => {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (emailRegex.test(text)) {
        return true
    } else {
        return false
    }
};

const passowrdStrength = (txt: string) => {
    const strength = passwordStrength(txt).id;
    if (strength > 1) {
        return true;
    } else {
        return false;
    }
};

const handleDownloadMedia = async (url: string, playlistId: string, songId: string) => {
    if (Platform.OS === 'ios') {
        const downloadUrl = await downloadFile(url, playlistId, songId);
        return downloadUrl
    } else {
        try {
            const apiLevel = await DeviceInfo.getApiLevel()
            const PERM = apiLevel < 33 ?
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
                :
                PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO
            const granted = await PermissionsAndroid.request(
                PERM,
                {
                    title: 'Storage Permission Required',
                    message: 'Application needs access to your storage to download File',
                    buttonPositive: 'OK'
                }
            );

            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                // Start downloading
                const downloadUrl = await downloadFile(url, playlistId, songId);
                return downloadUrl
                console.log('Storage Permission Granted.');
            } else {
                // If permission denied then show alert
                Alert.alert('Error', 'Storage Permission Not Granted', [
                    {
                        text: 'Allow in settings',
                        onPress: () => Linking.openSettings(),
                    },
                ]);

            }
        } catch (err) {
            // To handle permission related exception
            console.log("++++" + err);
        }
    }
};

const getFileExtention = (fileUrl: string) => {
    // To get the file extension
    return /[.]/.exec(fileUrl) ?
        /[^.]+$/.exec(fileUrl) : undefined;
};

const downloadFile = (fileUrl: string, playlistId: string, songId: string) => {
    return new Promise((resolve, reject) => {
        // Get today's date to add the time suffix in filename
        let date = new Date();
        // File URL which we want to download
        let FILE_URL = fileUrl;
        // Function to get extension of the file URL
        let file_ext: any = getFileExtention(FILE_URL);

        file_ext = '.' + file_ext[0];

        // config: To get response by passing the downloading related options
        // fs: Root directory path to download
        const { config, fs } = ReactNativeBlobUtil;
        let dirs = ReactNativeBlobUtil.fs.dirs;
        let path = Platform.OS === 'ios' ? dirs['MainBundleDir'] : RNFS.DownloadDirectoryPath

        let RootDir = fs.dirs.PictureDir;
        const finalPath = `${path}/keo/${playlistId}/${songId}${file_ext}`
        const hiddenPath = `${RootDir}/keodec/${playlistId}/${songId}${file_ext}`

        let options = {
            fileCache: true,
            addAndroidDownloads: {
                path: finalPath,
                description: 'downloading file...',
                notification: true,
                // useDownloadManager works with Android only
                useDownloadManager: true,
            },
        };

        config(options)
            .fetch('GET', FILE_URL)
            .then(async (res) => {
                const pathUrl = Platform.OS === "ios" ? res.path() : "file://" + res.path()
                resolve(pathUrl);
            })
            .catch((error) => {
                // Reject with the error message
                reject(error);
            });
    });
};

const getUniqueItems = (arr: any[]) => {
    const seenIds = new Set();
    return arr.filter(item => {
        if (!seenIds.has(item.ID)) {
            seenIds.add(item.ID);
            return true;
        }
        return false;
    });
}

const getUniqueAgende = (arr: any[]) => {
    const seenIds = new Set();
    return arr.filter(item => {
        if (!seenIds.has(item.scenario_id)) {
            seenIds.add(item.scenario_id);
            return true;
        }
        return false;
    });
}

const isTab = () => {
    const isTab = DeviceInfo.isTablet()
    return isTab
}

const tabHp = (size: number) => {
    const height = hp(100) - 180
    const per = size / 100
    return height * per
}

const mergeAgendePlaylist = (playLists_: any, AGENDES: IAgenda[]) => {
    const UNIQUE_AGENDE = getUniqueAgende(AGENDES)
    const commonAgande = UNIQUE_AGENDE.map((agenda: any) => {
        const exists = playLists_.find((playlist: any) => agenda?.scenario_id == playlist?.ScenarioID)
        if (exists) {
            return {
                ...exists,
                ...agenda
            }
        } else {
            return {
                ...agenda,
                ScenarioID: agenda?.scenario_id,
                ScenarioName: agenda?.scenario_name
            }
        }

    })

    const scenarioIdsFromAgende = commonAgande.map((item: IAgenda) => item.scenario_id);
    const filteredPlaylist = playLists_.filter((item: any) => !scenarioIdsFromAgende.includes(item.ScenarioID));

    const playLists = [...commonAgande, ...filteredPlaylist]
    playLists.sort((a, b) => a?.ScenarioID - b?.ScenarioID)
    return playLists

}

const deleteFile = async (file: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            await RNFS.unlink(file)
            resolve(true)
        } catch (error) {
            resolve(true)
        }

    })
}

const getFilesFromFolder = async (playlistId: string, decryptPath: boolean = true) => {
    try {
        let dirs = ReactNativeBlobUtil.fs.dirs;
        let path = Platform.OS === 'ios' ? dirs['MainBundleDir'] : RNFS.DownloadDirectoryPath
        const RootDir = dirs.PictureDir;
        path = decryptPath == true ? `${RootDir}/keodec/${playlistId}` : `${path}/keo/${playlistId}`
        const files = await RNFS.readDir(path)
        const filesArray = files.filter((file) => file?.isFile())
        const pathsArray = filesArray.map((file) => {
            const nameParts = file?.path?.split('/')
            const fileName = nameParts[nameParts?.length - 1]
            return {
                path: file.path,
                fileName: fileName
            }
        })
        return pathsArray
    } catch (error) {
        return []
    }
}

const getFileExists = async (playlistId: string, songId: string, decryptPath: boolean = true) => {
    try {
        let dirs = ReactNativeBlobUtil.fs.dirs;
        let path = Platform.OS === 'ios' ? dirs['MainBundleDir'] : RNFS.DownloadDirectoryPath
        const RootDir = dirs.PictureDir;
        path = decryptPath == true ?
            `${RootDir}/keodec/${playlistId}/${songId}.mp3`
            :
            `${path}/keo/${playlistId}/${songId}.mp3`
        const fileExists = await RNFS.exists(path);
        if (fileExists) {
            return true
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

const getTrackPlayerList = (playlist: ISong[], files: any[], playlistId: string) => {
    const mList = playlist.map((song: ISong) => {
        const exists = files.find((x) => x?.fileName == `${song.ID}.mp3`)
        return {
            ...song,
            title: song.Title,
            artist: song.Artist,
            artwork: song.songImg,
            url: exists?.path ?
                Platform.OS == 'ios' ?
                    exists?.path : `file://${exists?.path}` : false,
            id: `PL:${playlistId}-SI:${song.ID}`
        }
    })
    const filtered = mList.filter((x: any) => x.url)
    return filtered
}
const PLSIId = (PLSI: string) => {
    const IDparts = PLSI?.split('-') || ["00 : 00", "00 : 00"]
    const playlistId = IDparts[0]?.split(':')[1] || "00"
    const songId = IDparts[1]?.split(':')[1] || "00"
    return {
        playlistId,
        songId
    }
}

const isSubsExpired = (expiresIn: number) => {
    const date = new Date()
    const currentTime = date.getTime()
    if (currentTime > expiresIn) {
        return true
    } else {
        return false
    }
}

const getAllDownloaded = async (playlists: IPlayList[], setterFunc: any = () => { }) => {
    try {
        const data: any = {}
        let dirs = ReactNativeBlobUtil.fs.dirs;
        let path = Platform.OS === 'ios' ? dirs['MainBundleDir'] : RNFS.DownloadDirectoryPath
        for (let PL_Index = 0; PL_Index < playlists.length; PL_Index++) {
            const playListSingle = playlists[PL_Index];
            const mPath = `${path}/keo/${playListSingle.ScenarioID}`
            const exists = await RNFS.exists(mPath)
            if (!exists) {
                await RNFS.mkdir(mPath)
            }
            const songs = await getFilesFromFolder(playListSingle.ScenarioID, false)
            data[playListSingle.ScenarioID] = songs
        }
        return data
    } catch (error) {
        return {}
    }

}

const shuffleArray = (array: any) => {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex > 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}


export {
    getGreetings,
    passowrdStrength,
    vaildateEmail,
    handleDownloadMedia,
    getFileExtention,
    getUniqueItems,
    isTab,
    tabHp,
    mergeAgendePlaylist,
    deleteFile,
    getUniqueAgende,
    getFilesFromFolder,
    getFileExists,
    getTrackPlayerList,
    PLSIId,
    isSubsExpired,
    getAllDownloaded,
    shuffleArray
};
