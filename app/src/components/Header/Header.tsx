import React from "react";
import {useAtomValue} from "@mntm/precoil";
import {currentUserAtom} from "../../store";
import {Button, Avatar, Cell} from "@vkontakte/vkui";
import {Icon16Dropdown, Icon24DoorArrowRightOutline} from '@vkontakte/icons';
import './Header.scss';
import {Popover} from "@vkontakte/vkui/dist/components/Popover/Popover";

interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {

}

export const Header: React.FC<HeaderProps> = ({

}) => {
    const user = useAtomValue(currentUserAtom);
    return (
        <div className={'Header'}>
            <div className={'Header__in'}>
                <div className={'Logo'}>
                    <div>ВКОМПАКТЕ</div>
                </div>
                <div className={'Profile'}>
                    {user &&
                        <Popover content={
                            <>
                                <Cell before={<Avatar src={user.avatar} size={36}/>} subtitle="Перейти на страницу">
                                    {user.first_name} {user.last_name}
                                </Cell>
                                <Cell before={<Icon24DoorArrowRightOutline/>}>
                                    Выйти
                                </Cell>
                            </>
                        }>
                            <Button className={'UserAvatar'} mode={'tertiary'}>
                                <Avatar src={user.avatar}/>
                                <Icon16Dropdown/>
                            </Button>
                        </Popover>
                    }
                </div>
            </div>
        </div>
    )
}