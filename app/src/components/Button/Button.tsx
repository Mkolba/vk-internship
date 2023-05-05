import React from 'react';
import './Button.scss';

type ButtonMode = 'default' | 'secondary' | 'primary';

interface ButtonProps extends React.HTMLAttributes<HTMLImageElement> {
    mode: ButtonMode,
    size?: number,
    navTo?: string
}

export const Button: React.FC<ButtonProps> = ({

})=> {
    return (
        <div>

        </div>
    )
}