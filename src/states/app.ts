import { create } from 'zustand'
import { createSelectors } from './common'
import { IUser } from '../models/user';
import { IAgenda, IPlayList, ISong } from '../models/app';


/**
 * State Structure
 */
export interface IAppState {
  // State values
  isAuthenticated: boolean;
  currentUserId: string;
  user: IUser | {};
  setAuthenticated: (status: boolean, accessToken?: string) => void;
  setUser: (item: IUser) => void;
  accessToken: string;
  agendes: IAgenda[];
  setAgendes: (list: IAgenda[]) => void;
  playLists: IPlayList[];
  setPlayLists: (list: IPlayList[]) => void;
  playListSongs: ISong[];
  setPlayListSongs: (list: ISong[]) => void;
  secondaryLayout: boolean,
  setsecondaryLayout: (layout?: boolean) => void;
  enableAgende: boolean,
  setenableAgende: (layout?: boolean) => void;
  rootLoading: boolean;
  setRootLoading: (val: boolean) => void;
  isAppReady: boolean;
  setIsAppReady: (val: boolean) => void;
  isFileAdded: number;
  setIsFileAdded: (val: number) => void;
  refreshState: any; // Currenlty downloadlaoding playlist ID,
  setRefreshState: (val: any) => void;
  enableWelcomeScreen: any; // Currenlty downloadlaoding playlist ID,
  setEnableWelcomeScreen: (val: any) => void;
}

const initialState: IAppState = {
  user: {},
  isAuthenticated: false,
  currentUserId: '',
  setAuthenticated: () => { },
  setUser: () => { },
  accessToken: '',
  playLists: [],
  setPlayLists: () => { },
  agendes: [],
  setAgendes: () => { },
  playListSongs: [],
  setPlayListSongs: () => { },
  secondaryLayout: false,
  setsecondaryLayout: () => { },
  enableAgende: true,
  setenableAgende: () => { },
  rootLoading: false,
  setRootLoading: () => { },
  isAppReady: false,
  setIsAppReady: () => { },
  isFileAdded: 0,
  setIsFileAdded: () => { },
  refreshState: {},
  setRefreshState: () => { },
  enableWelcomeScreen: false,
  setEnableWelcomeScreen: () => { }
};

/**
 * State hook definition
 */
export const useApp = create<IAppState>((set, get) => ({
  ...initialState,
  setAuthenticated: (status, token) =>
  set({ isAuthenticated: status, accessToken: token ?? '' }),
  setUser: item => set({ user: item }),
  setPlayLists: list => set({ playLists: list }),
  setAgendes: list => set({ agendes: list }),
  setPlayListSongs: list => set({ playListSongs: list }),
  setsecondaryLayout: layout => set({ secondaryLayout: layout }),
  setenableAgende: val => set({ enableAgende: val }),
  setRootLoading: val => set({ rootLoading: val }),
  setIsAppReady: val => set({ isAppReady: val }),
  setIsFileAdded: val => set({ isFileAdded: val }),
  setRefreshState: val => set({ refreshState: val }),
  setEnableWelcomeScreen: val => set({ enableWelcomeScreen: val }),
}));

/**
 * Selectors
 */
export const appStateSelectors = createSelectors(initialState);
