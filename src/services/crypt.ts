import { NativeModules, Platform } from "react-native";
const { KeoCryptographyModule } = NativeModules;
import RNFS from 'react-native-fs';
import ReactNativeBlobUtil from "react-native-blob-util";

export const decryptSongsFolder = async (playlistId: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      let RootDir = ReactNativeBlobUtil.fs.dirs.PictureDir;
      let path = Platform.OS === 'ios' ?
        ReactNativeBlobUtil.fs.dirs['MainBundleDir'] : RNFS.DownloadDirectoryPath

      const hiddenPath = `${RootDir}/keodec/${playlistId}`

      const exists = await RNFS.exists(hiddenPath)
      if (!exists) {
        await RNFS.mkdir(hiddenPath)
      }

      const res = await KeoCryptographyModule.decryptFile(
        `${path}/keo/${playlistId}`,
        hiddenPath)
      resolve(true)
    } catch (error) {
      reject(false)
    }
  })
}

export const decryptSong = async (playlistId: any, songId: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      let RootDir = ReactNativeBlobUtil.fs.dirs.PictureDir;
      let path = Platform.OS === 'ios' ?
        ReactNativeBlobUtil.fs.dirs['MainBundleDir'] : RNFS.DownloadDirectoryPath

      const finalPath = `${path}/keo/${playlistId}/${songId}.mp3`
      const hiddenPath = `${RootDir}/keodec/${playlistId}`

      const exists = await RNFS.exists(hiddenPath)
      if (!exists) {
        await RNFS.mkdir(hiddenPath)
      }

      const res = await KeoCryptographyModule.decryptSingleFile(
        finalPath,
        hiddenPath)
      resolve(`file://${hiddenPath}/${songId}.mp3`)
    } catch (error) {
      reject("false")
    }
  })
}

export const hiddenPath = (playlistId: string, songId: string) => {
  let RootDir = ReactNativeBlobUtil.fs.dirs.PictureDir;
  let path = Platform.OS === 'ios' ?
    ReactNativeBlobUtil.fs.dirs['MainBundleDir'] : RNFS.DownloadDirectoryPath

  const finalPath = `${path}/keo/${playlistId}/${songId}.mp3`
  const hiddenPath = `${RootDir}/keodec/${playlistId}/${songId}.mp3`
  return {
    finalPath,
    hiddenPath
  }
}