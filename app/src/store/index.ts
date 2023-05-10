import {ReactNode} from "react";
import { atom } from '@mntm/precoil'
import { ThemeType, UserType } from "../types"

export const themeAtom = atom<ThemeType>('light');
export const currentUserAtom = atom<UserType | null>(null);

export const popoutAtom = atom<ReactNode | null>(null)