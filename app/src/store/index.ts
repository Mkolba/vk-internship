import {ReactNode} from "react";
import { atom } from '@mntm/precoil'
import { ThemeType, UserType } from "../types"

export const themeAtom = atom<ThemeType>('light');
export const currentUserAtom = atom<UserType | null>({
    id: 1,
    token: '',
    avatar: 'https://vk.com/images/camera_200.png',
    first_name: 'Егор',
    last_name: 'Горошкин',
    city: 'Пермь',
    age: 19,
    study_place: 'ПГНИУ'
});

export const popoutAtom = atom<ReactNode | null>(null)