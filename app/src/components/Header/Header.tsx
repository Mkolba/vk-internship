import React from "react";
import {useAtomValue} from "@mntm/precoil";
import {currentUserAtom} from "../../store";
import {Button, Avatar, Cell} from "@vkontakte/vkui";
import {Icon16Dropdown, Icon24DoorArrowRightOutline} from '@vkontakte/icons';
import './Header.scss';
import {Popover} from "@vkontakte/vkui/dist/components/Popover/Popover";
import {useNavigate} from "react-router-dom";

interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {

}

export const Header: React.FC<HeaderProps> = ({

}) => {
    const user = useAtomValue(currentUserAtom);
    const navigate = useNavigate();
    return (
        <div className={'Header'}>
            <div className={'Header__in'}>
                <div className={'Logo'}>
                    <div>NotVK</div>
                </div>
                <div className={'Profile'}>
                    {user &&
                        <Popover content={
                            <>
                                <Cell before={<Avatar src={user.avatar?.url} size={36}/>} subtitle="Перейти на страницу" onClick={() => navigate(`/profile/${user.id}`)}>
                                    {user.first_name} {user.last_name}
                                </Cell>
                                <Cell before={<Icon24DoorArrowRightOutline/>}>
                                    Выйти
                                </Cell>
                            </>
                        }>
                            <Button className={'UserAvatar'} mode={'tertiary'}>
                                <Avatar src={user.avatar?.url}/>
                                <Icon16Dropdown/>
                            </Button>
                        </Popover>
                    }
                </div>
            </div>
        </div>
    )
}