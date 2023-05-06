export type AnyFunction = (...args: any[]) => any;

export type ThemeType = 'light' | 'dark';

export type SizeType = 's' | 'm' | 'l'

export type User = {
    id: number,
    token: string,
    avatar: string | undefined
}