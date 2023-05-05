import React from 'react';
import {useNavigate} from "react-router-dom";
import './Avatar.scss';

type AvatarMode = 'default' | 'square';

interface AvatarProps extends React.HTMLAttributes<HTMLImageElement> {
    src: string | undefined,
    mode: AvatarMode,
    size?: number,
    navTo?: string,
}

export const Avatar: React.FC<AvatarProps> = ({
    src,
    navTo,
    mode,
    size = 32,
    className,
    onClick,
    ...restProps
}) => {
    let navigate = useNavigate();

    const handleClick = (e: React.MouseEvent<HTMLImageElement>) => {
        if (navTo) navigate(navTo);
        if (onClick) onClick(e);
    }

    return (
        <div
            className={`Avatar Avatar-${mode}` + (className ? ` ${className}` : '')}
            style={{width: size, height: size}}
            onClick={handleClick}
            {...restProps}
        >
            <div className={'Avatar__in'}>
                <img className={'Avatar__img'} src={src} alt={''}/>
            </div>
        </div>
    )
}