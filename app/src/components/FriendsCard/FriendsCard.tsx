import React from "react";
import {Group, Header, Placeholder, Avatar, Tappable, Separator, Cell, UsersStack} from "@vkontakte/vkui";
import {UserType} from "../../types";
import {useNavigate} from "react-router-dom";
import './FriendsCard.scss';
import {useScreenType} from "../../hooks";

interface FriendsCardProps extends React.HTMLAttributes<HTMLDivElement> {
    user: UserType
}
export const FriendsCard: React.FC<FriendsCardProps> = ({
    user,
    ...restProps
}) => {
    const friends = [1,2,3,4]
    const navigate = useNavigate();
    const screenType = useScreenType();
    return (
        <>
            <Separator className={'FriendsCard__separator'}/>
            <Group header={screenType === 'desktop' && <Header onClick={() => navigate('/friends')} indicator={screenType === 'desktop' ? 11 : null}>Друзья</Header>} {...restProps}>
                {friends.length ?
                    screenType === 'desktop' ?
                        <div className={'FriendsCard__list'}>
                            {friends.map(item => (
                                <Tappable className={'FriendsCard__list__item'} key={item} onClick={() => navigate(`/profile/${item}`)}>
                                    <Avatar src={'https://vk.com/images/camera_200.png'} size={64}/>
                                    Друг
                                </Tappable>
                            ))}
                        </div>
                    :
                        <Cell after={<UsersStack photos={['https://vk.com/images/camera_200.png', 'https://vk.com/images/camera_200.png', 'https://vk.com/images/camera_200.png']}/>} badgeAfterTitle={11}>
                            Друзья
                        </Cell>
                :
                <Placeholder>
                    У вас нет друзей
                </Placeholder>
                }
            </Group>
        </>
    )
}
