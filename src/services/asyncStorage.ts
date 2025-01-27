import {ASYNC_KEYS} from '../constants/common';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ISong } from '../models/app';

export const setItem = async (
  key: ASYNC_KEYS,
  value: string | number | boolean | object | null,
) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    return Promise.reject(error);
  }
};

export const removeItem = async (key: ASYNC_KEYS) => {
  try {
    AsyncStorage.removeItem(key);
  } catch (error) {
    console.log('error', error);
  }
};


export const getItem = async <T>(key: ASYNC_KEYS, defaultValue?: T) => {
  try {
    const respString = await AsyncStorage.getItem(key);
    if (respString) {
      return Promise.resolve(JSON.parse(respString) as T);
    }
    return defaultValue !== undefined
      ? Promise.resolve(defaultValue)
      : Promise.reject(new Error(`No item for ${key}`));
  } catch (error) {
    console.log('error', error);
    return Promise.reject(error);
  }
};

export const mergeItem = (
  key: ASYNC_KEYS,
  value: Record<string | number, string | number | boolean | object>,
) => {
  try {
    console.log('key', key);
    console.log('JSON.stringify(value)', JSON.stringify(value));
    return AsyncStorage.mergeItem(key, JSON.stringify(value));
  } catch (error) {
    console.log('error', error);
    return Promise.reject(error);
  }
};

export const mergeArray = async (
  key: ASYNC_KEYS,
  value: ISong,
) => {
  try {
    const res = await getItem(key, [])
    const filtered = res.filter((x: ISong) => x.id != value.id)
    const mList = [...filtered, value]
    await setItem(key, mList)
  } catch (error) {
    return Promise.reject(error);
  }
};


