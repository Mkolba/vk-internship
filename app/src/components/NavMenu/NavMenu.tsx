import React from "react";
import {Cell, Group, SplitCol} from "@vkontakte/vkui";
import {
    Icon24MessagesOutline,
    Icon24NewsfeedOutline,
    Icon24UserCircleOutline,
    Icon24UsersOutline
} from "@vkontakte/icons";
import {useNavigate} from "react-router-dom";
import {useAtomValue} from "@mntm/precoil";
import {currentUserAtom} from "../../store";


export const NavMenu: React.FC = () => {
    const navigate = useNavigate();
    const user = useAtomValue(currentUserAtom);
    return (
        <SplitCol maxWidth={220} width={'100%'}>
            <Cell before={<Icon24UserCircleOutline/>} onClick={() => navigate(`/profile/${user?.id}`)}>
                Моя страница
            </Cell>
            <Cell before={<Icon24NewsfeedOutline/>} onClick={() => navigate('/newsfeed')}>
                Новости
            </Cell>
            <Cell before={<Icon24UsersOutline/>} onClick={() => navigate(`/friends/${user?.id}`)}>
                Друзья
            </Cell>
        </SplitCol>
    )
}