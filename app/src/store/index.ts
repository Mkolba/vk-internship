import {ReactNode} from "react";
import { atom } from '@mntm/precoil'
import { ThemeType, IUser } from "../types"

export const themeAtom = atom<ThemeType>('light');
export const currentUserAtom = atom<IUser | null>(null);

export const popoutAtom = atom<ReactNode | null>(null)