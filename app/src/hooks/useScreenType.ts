import { useLayoutEffect, useState } from 'react';
import {ScreenType} from "../types";

export function useScreenType() {
    const [screenType, setScreenType] = useState<ScreenType>('desktop');
    useLayoutEffect(() => {
        function updateType() {
            if (window.innerWidth >= 1200) {
                setScreenType('desktop')
            } else {
                setScreenType('mobile')
            }
        }
        window.addEventListener('resize', updateType);
        updateType();
        return () => window.removeEventListener('resize', updateType);
    }, []);
    return screenType;
}