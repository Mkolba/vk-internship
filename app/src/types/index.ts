export type AnyFunction = (...args: any[]) => any;

export type ThemeType = 'light' | 'dark';

export type ScreenType = 'desktop' | 'mobile';

export interface IPhoto {
    id?: string,
    uploaded_by?: number,
    url: string
}

export interface IPost {
    id: number,
    wall_id: number,
    creator: IUser,
    date: string,
    is_liked: boolean,
    likes_count: number,
    photo?: IPhoto,
    text?: string
}

export interface IUser {
    id: number,
    avatar: IPhoto,
    first_name: string,
    last_name: string,
    city?: string,
    age?: number,
    study_place?: string
    friend_status?: number,
    birthdate?: string
}