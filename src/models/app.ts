export interface IAgenda {
    id: string;
    title: string;
    start: string;
    end: string;
    admin: string | null;
    scenario_id: string;
    scenario_name: string;
    scenario_type: string;
    scenario_owner_id: string;
    scenario_admin: number;
}

export interface IPlayList {
    Cover: string;
    ID: string;
    DeviceID: string;
    DeviceMACAddress: string;
    ScenarioID: string;
    ScenarioName: string;
    ScenarioType: string;
    ScenarioDuration: string;
    ScenarioSongs: string;
    DateAndTime: string;
}

export interface ISong {
    ID: string;
    PlaylistID: string;
    MediaID: string;
    ID_Artist: string;
    Artist: string;
    Title: string;
    Album: string;
    Year: string;
    Bpm: string;
    Energy: string;
    Rythm: string;
    ID_Genre: string;
    Genre: string;
    ID_Category: string;
    Category: string;
    ID_Language: string;
    Language: string;
    Guid: string;
    Duration: string;
    Time: string;
    MediaType: string;
    MarketType: string;
    ID_SecondCategory: string;
    SecondCategory: string;
    VolumeLevel: string;
    Cover: string;
    Hit: string;
    DJ1: string;
    InsertDate: string;
    DateAndTime: string;
    songUrl: string;
    songImg: string;
    songImgSmall: string;
    title?: string;
    artist?: string;
    artwork?: string;
    url?: any;
    id?: string;
}

export interface IFilePath {
    path: string;
    fileName: string;
}