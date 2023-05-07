export type AnyFunction = (...args: any[]) => any;

export type ThemeType = 'light' | 'dark';

export type SizeType = 's' | 'm' | 'l'

export type UserType = {
    id: number,
    token: string,
    avatar?: string,
    first_name: string,
    last_name: string,
    city?: string,
    age?: number,
    study_place?: string
}