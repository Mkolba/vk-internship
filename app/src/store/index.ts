import {ReactNode} from "react";
import { atom } from '@mntm/precoil'
import { ThemeType, User } from "../types"

export const themeAtom = atom<ThemeType>('light');
export const currentUserAtom = atom<User | null>(null);

export const popoutAtom = atom<ReactNode | null>(null)