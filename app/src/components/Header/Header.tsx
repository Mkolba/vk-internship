import React from "react";
import {useAtomValue} from "@mntm/precoil";
import {currentUserAtom} from "../../store";
import {Button, Avatar} from "@vkontakte/vkui";
import { Icon28GlobeOutline } from '@vkontakte/icons';
import './Header.scss';

interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {

}

export const Header: React.FC<HeaderProps> = ({

}) => {
    const user = useAtomValue(currentUserAtom);
    return (
        <div className={'Header'}>
            <div className={'Logo'}>
                <div>NOTVK</div>
            </div>
            <div className={'Profile'}>
                {user ?
                    <Avatar src={user.avatar}/>
                    :
                    <Button href={'login'} mode={'outline'} size={'m'}>
                        Войти
                    </Button>
                }
            </div>
        </div>
    )
}