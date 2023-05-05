import React from 'react';
import './Input.scss';

type InputMode = 'default' | 'error';

interface ButtonProps extends React.HTMLAttributes<HTMLInputElement> {
    mode: InputMode,
}

export const Input: React.FC<ButtonProps> = ({

})=> {
    return (
        <div className={'Input'}>

        </div>
    )
}