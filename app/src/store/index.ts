import { atom } from '@mntm/precoil'
import { ThemeType } from "../types"

export const themeAtom = atom<ThemeType>('light');